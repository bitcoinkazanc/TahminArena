"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Loading from "@/components/ui/Loading";
import type {
  SearchResult,
  SearchResponse,
} from "@/types/search";

type SearchBoxProps = {
  placeholder?: string;
};

export default function SearchBox({
  placeholder = "Kullanıcı, maç veya tahmin ara...",
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] =
    useState<SearchResult[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState(false);

  async function handleSearch(
    value: string,
  ) {
    const trimmedValue = value.trim();

    setQuery(value);

    if (!trimmedValue) {
      setResults([]);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(
          trimmedValue,
        )}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Arama yapılamadı.",
        );
      }

      const data =
        (await response.json()) as SearchResponse & {
          success: boolean;
        };

      if (
        !data.success ||
        !Array.isArray(data.results)
      ) {
        throw new Error(
          "Geçersiz arama sonucu.",
        );
      }

      setResults(data.results);
    } catch (searchError) {
      console.error(
        "Search box error:",
        searchError,
      );

      setResults([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function renderResult(
    result: SearchResult,
  ) {
    if (result.type === "user") {
      return (
        <Link
          key={`user-${result.id}`}
          href={`/profile/${encodeURIComponent(
            result.username,
          )}`}
          className="search-result"
        >
          <Avatar
            src={result.avatarUrl}
            name={result.displayName}
            alt={`${result.displayName} profil fotoğrafı`}
            size="small"
          />

          <div className="search-result__content">
            <strong>
              {result.displayName}
            </strong>

            <span>
              @{result.username}
            </span>
          </div>
        </Link>
      );
    }

    if (result.type === "match") {
      return (
        <Link
          key={`match-${result.id}`}
          href={`/matches/${encodeURIComponent(
            result.id,
          )}`}
          className="search-result"
        >
          <span
            className="search-result__icon"
            aria-hidden="true"
          >
            ⚽
          </span>

          <div className="search-result__content">
            <strong>
              {result.homeTeam} -{" "}
              {result.awayTeam}
            </strong>

            <span>{result.status}</span>
          </div>
        </Link>
      );
    }

    return (
      <Link
        key={`prediction-${result.id}`}
        href={`/predictions/${encodeURIComponent(
          result.id,
        )}`}
        className="search-result"
      >
        <span
          className="search-result__icon"
          aria-hidden="true"
        >
          🔮
        </span>

        <div className="search-result__content">
          <strong>
            {result.homeTeam} -{" "}
            {result.awayTeam}
          </strong>

          <span>
            @{result.username} · Tahmin:{" "}
            {result.option}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <section className="search-box">
      <label
        className="search-box__label"
        htmlFor="global-search"
      >
        🔎 Ara
      </label>

      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(event) =>
          void handleSearch(
            event.target.value,
          )
        }
        placeholder={placeholder}
        maxLength={100}
        autoComplete="off"
      />

      {loading && (
        <Loading
          text="Aranıyor..."
          size="small"
        />
      )}

      {!loading && error && (
        <div className="empty-state">
          <strong>
            Arama yapılamadı
          </strong>

          <span>
            Lütfen biraz sonra tekrar dene.
          </span>
        </div>
      )}

      {!loading &&
        !error &&
        query.trim() &&
        results.length === 0 && (
          <div className="empty-state">
            <strong>
              Sonuç bulunamadı
            </strong>

            <span>
              Farklı bir kullanıcı adı, takım
              veya tahmin ara.
            </span>
          </div>
        )}

      {!loading &&
        !error &&
        results.length > 0 && (
          <div
            className="search-box__results"
            aria-label="Arama sonuçları"
          >
            {results.map(renderResult)}
          </div>
        )}
    </section>
  );
}