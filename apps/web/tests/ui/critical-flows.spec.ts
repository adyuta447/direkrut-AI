import { expect, test, type Page, type Route } from "@playwright/test"

const API_BASE_URL = "http://127.0.0.1:3999"

const API_JOB = {
  id: "job-qa-001",
  companyId: "company-qa-001",
  companyName: "PT QA Nusantara",
  companyIndustry: "Teknologi",
  title: "Software Quality Engineer",
  department: "Engineering",
  description: "Menjaga kualitas platform rekrutmen melalui automation dan exploratory testing.",
  requirements: "Memahami Playwright\nMampu menyusun test case",
  location: "Jakarta (Hybrid)",
  employmentType: "full-time",
  salaryMin: 10_000_000,
  salaryMax: 16_000_000,
  status: "published",
  publishedAt: "2026-07-25T08:00:00.000Z",
  createdAt: "2026-07-25T08:00:00.000Z",
  requiredSkills: ["Playwright", "TypeScript"],
  preferredSkills: ["CI/CD"],
  keyResponsibilities: "Membangun regression suite",
  minExperienceYears: 2,
  educationRequirement: "S1 atau pengalaman setara",
  candidateType: "professional",
  applicantCount: 3,
}

const API_APPLICATION = {
  id: "app-qa-001",
  jobId: API_JOB.id,
  jobTitle: API_JOB.title,
  candidateId: "candidate-qa-001",
  candidateName: "Nadia QA",
  status: "under-review",
  appliedAt: "2026-07-26T01:00:00.000Z",
  updatedAt: "2026-07-26T01:00:00.000Z",
  recommendationScore: 82,
  candidateProfile: {
    email: "nadia.qa@example.com",
    phone: "+628123456789",
    location: "Jakarta",
    experience: [{ role: "QA Engineer", company: "PT Uji", startDate: "2023", endDate: "2026" }],
    education: [{ school: "Universitas Indonesia", degree: "S1", startYear: "2019", endYear: "2023" }],
  },
}

const CANDIDATE_PROFILE = {
  name: "Nadia QA",
  phone: "+628123456789",
  location: "Jakarta",
  age: 25,
  gender: "Perempuan",
  about: "Quality engineer",
  cvFileUrl: "candidates/candidate-qa-001/cv.pdf",
  experience: [],
  education: [],
  links: [],
  skills: ["Playwright"],
}

function accessToken(role: "candidate" | "hrd") {
  const payload = Buffer.from(
    JSON.stringify({ sub: `${role}-qa-001`, role }),
  ).toString("base64url")
  return `eyJhbGciOiJub25lIn0.${payload}.qa-signature`
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  })
}

async function mockApi(page: Page) {
  await page.route(`${API_BASE_URL}/**`, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname
    const method = request.method()

    if (path === "/v1/auth/login" && method === "POST") {
      const requestBody = request.postDataJSON() as { email: string }
      const role = requestBody.email.startsWith("hrd") ? "hrd" : "candidate"
      return fulfillJson(route, {
        accessToken: accessToken(role),
        refreshToken: "qa-refresh-token",
      })
    }

    if (path === "/v1/jobs" && method === "GET") {
      return fulfillJson(route, { items: [API_JOB] })
    }
    if (path === "/v1/jobs/mine" && method === "GET") {
      return fulfillJson(route, { items: [API_JOB] })
    }
    if (path === `/v1/jobs/${API_JOB.id}` && method === "GET") {
      return fulfillJson(route, API_JOB)
    }
    if (path === "/v1/jobs" && method === "POST") {
      const body = request.postDataJSON() as Record<string, unknown>
      return fulfillJson(
        route,
        {
          ...API_JOB,
          ...body,
          id: "job-created-by-ui",
          companyName: API_JOB.companyName,
          companyIndustry: API_JOB.companyIndustry,
          createdAt: "2026-07-26T03:00:00.000Z",
          publishedAt: "2026-07-26T03:00:00.000Z",
        },
        201,
      )
    }

    if (path === "/v1/applications" && method === "GET") {
      return fulfillJson(route, { items: [API_APPLICATION] })
    }
    if (path === "/v1/applications" && method === "POST") {
      return fulfillJson(route, { ...API_APPLICATION, status: "submitted" }, 201)
    }
    if (path === "/v1/notifications" && method === "GET") {
      return fulfillJson(route, { items: [] })
    }
    if (path === "/v1/candidates/me" && method === "GET") {
      return fulfillJson(route, CANDIDATE_PROFILE)
    }
    if (path === "/v1/candidates/me" && method === "PUT") {
      return fulfillJson(route, CANDIDATE_PROFILE)
    }

    return fulfillJson(route, {
      error: { code: "qa_mock_missing", message: `Mock belum tersedia untuk ${method} ${path}` },
    }, 501)
  })
}

async function authenticateAs(page: Page, role: "candidate" | "hrd") {
  await page.addInitScript(
    ({ currentRole, token }) => {
      localStorage.setItem("direkrut_access_token", token)
      localStorage.setItem("direkrut_refresh_token", "qa-refresh-token")
      localStorage.setItem(
        "direkrut_user",
        JSON.stringify({
          id: `${currentRole}-qa-001`,
          name: currentRole === "hrd" ? "Hana Recruiter" : "Nadia QA",
          email: `${currentRole}@example.com`,
          role: currentRole,
        }),
      )
    },
    { currentRole: role, token: accessToken(role) },
  )
}

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test("AUTO-01 — portal publik menampilkan dan memfilter lowongan", async ({ page }) => {
  await page.goto("/jobs")

  await expect(page.getByRole("heading", { name: API_JOB.title }).first()).toBeVisible()
  await expect(page.getByText(API_JOB.companyName).first()).toBeVisible()

  await page.getByPlaceholder("Cari posisi atau perusahaan").fill("Quality Engineer")
  await expect(page.getByRole("heading", { name: API_JOB.title }).first()).toBeVisible()

  await page.getByPlaceholder("Cari posisi atau perusahaan").fill("Dokter Hewan")
  await expect(page.getByText(/Belum ada lowongan yang cocok/i)).toBeVisible()
})

test("AUTO-02 — login kandidat menyimpan sesi dan membuka dashboard kandidat", async ({ page }) => {
  await page.goto("/auth/login")
  await page.getByLabel("Email").fill("candidate@example.com")
  await page.getByLabel("Kata Sandi").fill("rahasia123")
  const loginRequest = page.waitForRequest(
    (request) => request.url() === `${API_BASE_URL}/v1/auth/login` && request.method() === "POST",
  )
  await page.getByRole("button", { name: "Masuk" }).click()
  await loginRequest

  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("direkrut_user") ?? "null")?.role))
    .toBe("candidate")
  await expect(page).toHaveURL(/\/candidate$/, { timeout: 30_000 })
  await expect(page.getByRole("heading", { name: /Halo, Nadia QA/i })).toBeVisible()
})

test("AUTO-03 — kandidat mengisi data, memakai CV tersimpan, dan mengirim lamaran", async ({ page }) => {
  await authenticateAs(page, "candidate")
  await page.goto(`/candidate/apply/${API_JOB.id}`)

  await expect(page.getByRole("heading", { name: `Melamar untuk ${API_JOB.title}` })).toBeVisible()
  await page.getByLabel("Nama Lengkap").fill("Nadia QA")
  await page.getByLabel("Email").fill("nadia.qa@example.com")
  await page.getByLabel("Nomor Telepon").fill("+628123456789")
  await page.getByRole("button", { name: /Selanjutnya/ }).click()

  await expect(page.getByText("CV kamu siap dikirim")).toBeVisible()
  await page.getByRole("button", { name: /Selanjutnya/ }).click()
  await expect(page.getByRole("heading", { name: "Tinjauan Lamaran" })).toBeVisible()

  await page.getByRole("button", { name: "Kirim Lamaran" }).click()
  await expect(page.getByRole("heading", { name: "Lamaran Terkirim!" })).toBeVisible()
})

test("AUTO-04 — HRD membuat dan mempublikasikan lowongan", async ({ page }) => {
  await authenticateAs(page, "hrd")
  await page.goto("/hrd/jobs/new")

  await page.getByLabel("Judul Pekerjaan").fill("QA Automation Engineer")
  await page.getByText("Pilih...").first().click()
  await page.getByRole("option", { name: "Engineering" }).click()
  await page.getByText("Pilih...").first().click()
  await page.getByRole("option", { name: "Penuh Waktu" }).click()
  await page.getByLabel("Lokasi").fill("Jakarta (Hybrid)")
  await page.getByLabel("Deskripsi Pekerjaan (Umum)").fill("Membangun automation test yang stabil.")
  await page.getByLabel("Kualifikasi Tambahan").fill("Menguasai Playwright\nMemahami CI/CD")

  const createRequest = page.waitForRequest(
    (request) => request.url() === `${API_BASE_URL}/v1/jobs` && request.method() === "POST",
  )
  await page.getByRole("button", { name: "Publikasikan Lowongan" }).click()
  const request = await createRequest

  expect(request.postDataJSON()).toMatchObject({
    title: "QA Automation Engineer",
    department: "Engineering",
    status: "published",
  })
  await expect(page).toHaveURL(/\/hrd\/jobs\?notice=created/)
})

test("AUTO-05 — role guard mencegah kandidat membuka dashboard HRD", async ({ page }) => {
  await authenticateAs(page, "candidate")
  await page.goto("/hrd")

  await expect(page).toHaveURL(/\/candidate$/)
  await expect(page.getByText(/Halo, Nadia QA/i)).toBeVisible()
})

test("AUTO-06 — written test hanya dapat dikirim setelah jawaban valid", async ({ page }) => {
  await authenticateAs(page, "candidate")
  await page.goto(`/candidate/apply/${API_JOB.id}/written-test`)

  const submitButton = page.getByRole("button", { name: "Selesai & Lanjut Wawancara" })
  await expect(submitButton).toBeDisabled()
  await page.getByPlaceholder("Tuliskan jawabanmu di sini...").fill("Saya akan meningkatkan kualitas sejak hari pertama.")
  await expect(submitButton).toBeEnabled()
  await submitButton.click()

  await expect(page).toHaveURL(new RegExp(`/interview/${API_JOB.id}$`), { timeout: 30_000 })
})

test("AUTO-07 — written test auto-submit tepat saat timer berakhir", async ({ page }) => {
  await authenticateAs(page, "candidate")
  await page.clock.install()
  await page.goto(`/candidate/apply/${API_JOB.id}/written-test`)

  // Jalankan timer framework agar hydration selesai, lalu majukan seluruh
  // interval satu per satu sampai batas waktu dan delay submit terlewati.
  await page.clock.runFor(1_000)
  await expect(page.getByText("4:59")).toBeVisible()
  await page.clock.runFor(301_000)

  await expect(page).toHaveURL(new RegExp(`/interview/${API_JOB.id}$`), { timeout: 30_000 })
})
