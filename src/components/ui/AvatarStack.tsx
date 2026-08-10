import { initials } from "@/lib/format";

type Person = {
  id: string;
  name: string;
  photo_url?: string | null;
};

type Props = {
  people: Person[];
  size?: number;
  max?: number;
  className?: string;
};

/** Overlapping face row used for social proof in the hero and closing bands. */
export function AvatarStack({ people, size = 36, max = 4, className = "" }: Props) {
  const shown = people.slice(0, max);
  const overlap = Math.round(size / 3);

  return (
    <ul className={`flex items-center ${className}`}>
      {shown.map((person, index) => (
        <li
          key={person.id}
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            zIndex: shown.length - index,
            width: size,
            height: size,
          }}
          className="relative"
        >
          {person.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.photo_url}
              alt={person.name}
              width={size}
              height={size}
              className="h-full w-full rounded-full object-cover ring-[3px] ring-white"
            />
          ) : (
            <span
              title={person.name}
              style={{ fontSize: Math.round(size / 3) }}
              className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-100 via-brand-50 to-mint-100 font-semibold text-brand-700 ring-[3px] ring-white"
            >
              {initials(person.name)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
