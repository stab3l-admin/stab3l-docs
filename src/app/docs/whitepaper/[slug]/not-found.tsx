export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-lg mb-8">
        The whitepaper document you're looking for doesn't exist.
      </p>
      <p>
        Please check the URL or navigate back to the{" "}
        <a href="/docs" className="underline">
          documentation homepage
        </a>
        .
      </p>
    </div>
  );
} 