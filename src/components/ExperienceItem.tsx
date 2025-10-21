type ExperienceBullet = { point: string; tag?: string[] };

type ExperienceIcon = { src: string; link: string } | null;

type ExperienceRecord = {
  org: string;
  position: string;
  startYear: string;
  endYear: string | "Present";
  ongoing: boolean;
  details: ExperienceBullet[];
  icon: ExperienceIcon;
  hideOnSite: boolean;
  hideOnResume: boolean;
};

function normalizeTag(s: string): string {
  return s.trim().toLowerCase();
}

function bulletMatchesSelected(
  bullet: ExperienceBullet,
  selected: ReadonlyArray<string> | undefined
): boolean {
  const want = new Set((selected ?? []).map(normalizeTag));
  if (want.size === 0) return false;
  const src = Array.isArray(bullet.tag) ? bullet.tag : [];
  const tags = new Set<string>();
  for (const raw of src) {
    for (const p of raw.split(/[\s,]+/)) {
      const t = normalizeTag(p);
      if (t) tags.add(t);
    }
  }
  if (tags.has("always")) return true;
  for (const w of want) if (tags.has(w)) return true;
  return false;
}

export default function ExperienceItem({
  item,
  selectedTags,
}: {
  item: ExperienceRecord;
  selectedTags?: ReadonlyArray<string>;
}) {
  const dateText = `${item.startYear} – ${item.endYear}`;
  const filteredDetails = item.details.filter((d) =>
    bulletMatchesSelected(d, selectedTags)
  );

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        columnGap: "0.75rem",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          background: "rgba(255,255,255,0.6)",
          overflow: "hidden",
        }}
      >
        {item.icon?.src ? (
          <img
            src={item.icon.src}
            alt={item.org}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          rowGap: "0.25rem",
          alignItems: "start",
        }}
      >
        <h2
          style={{
            gridColumn: 1,
            margin: 0,
            color: "white",
            fontSize: "2rem",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          {item.position}
        </h2>

        <div
          style={{
            gridColumn: 2,
            color: "white",
            opacity: 0.9,
            fontSize: "1rem",
            fontStyle: "italic",
            alignSelf: "center",
            justifySelf: "end",
            whiteSpace: "nowrap",
          }}
        >
          {dateText}
        </div>

        <div
          style={{
            gridColumn: "1 / 4",
            color: "white",
            opacity: 0.9,
            fontSize: "1.05rem",
          }}
        >
          {item.org}
        </div>

        {filteredDetails.length > 0 ? (
          <ul
            style={{
              gridColumn: "1 / 3",
              margin: 0,
              paddingLeft: "1.25rem",
              color: "white",
              fontSize: "1.125rem",
            }}
          >
            {filteredDetails.map((d, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom:
                    idx < filteredDetails.length - 1 ? "0.25rem" : 0,
                }}
              >
                {d.point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
