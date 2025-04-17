"use client";

export const NavigationButtons = ({ poetId, poemId, poemCount }) => {
  // In a real app, you would fetch adjacent poems from the server
  const [prevPoem, setPrevPoem] = useState(null);
  const [nextPoem, setNextPoem] = useState(null);

  // This is a placeholder - implement actual navigation logic
  const hasPrev = poemId > 1;
  const hasNext = poemId < poemCount;

  return (
    <div className="flex justify-between mt-12">
      {hasPrev ? (
        <Link
          href={`/poets/${poetId}/poems/${parseInt(poemId) - 1}`}
          className="btn btn-ghost gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          شعر قبلی
        </Link>
      ) : (
        <div className="btn btn-ghost btn-disabled gap-2">شعر قبلی</div>
      )}

      {hasNext ? (
        <Link
          href={`/poets/${poetId}/poems/${parseInt(poemId) + 1}`}
          className="btn btn-ghost gap-2"
        >
          شعر بعدی
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      ) : (
        <div className="btn btn-ghost btn-disabled gap-2">شعر بعدی</div>
      )}
    </div>
  );
};
