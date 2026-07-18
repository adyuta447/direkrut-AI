"""Cache-aside di app/cache.py adalah inti dari 'jangan bayar dua kali buat
panggilan AI yang sama' -- tes ini mastiin compute() cuma jalan sekali
buat key yang sama, dan hasil cache-nya balik persis sama.
"""

from __future__ import annotations

import pytest

from app.cache import get_or_set, make_cache_key


def test_make_cache_key_is_deterministic_and_namespaced() -> None:
    key_a = make_cache_key("cv_parse", "object-key-1", "app-1")
    key_b = make_cache_key("cv_parse", "object-key-1", "app-1")
    key_c = make_cache_key("cv_parse", "object-key-2", "app-1")

    assert key_a == key_b
    assert key_a != key_c
    assert key_a.startswith("cv_parse:")


@pytest.mark.asyncio
async def test_get_or_set_only_computes_once_on_repeated_calls() -> None:
    call_count = 0

    async def compute() -> dict:
        nonlocal call_count
        call_count += 1
        return {"summary": "hasil mahal", "skills": ["python"]}

    key = make_cache_key("test", "same-input")

    first_value, first_hit = await get_or_set(key, compute)
    second_value, second_hit = await get_or_set(key, compute)

    assert call_count == 1  # compute() cuma dipanggil sekali, bukan dua kali
    assert first_hit is False
    assert second_hit is True
    assert first_value == second_value == {"summary": "hasil mahal", "skills": ["python"]}


@pytest.mark.asyncio
async def test_get_or_set_computes_separately_for_different_keys() -> None:
    call_count = 0

    async def compute() -> dict:
        nonlocal call_count
        call_count += 1
        return {"n": call_count}

    key_a = make_cache_key("test", "input-a")
    key_b = make_cache_key("test", "input-b")

    await get_or_set(key_a, compute)
    await get_or_set(key_b, compute)

    assert call_count == 2
