"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{ fontFamily: "system-ui, sans-serif", color: "#162839", background: "#f6f8fb", padding: "15vh 20px", textAlign: "center" }}>
    <main><h1>Something went wrong</h1><p>We couldn’t display this page. Please try again.</p><button onClick={reset} style={{ background: "#163b5c", color: "white", padding: "12px 20px", borderRadius: "10px", border: 0 }}>Try again</button></main>
  </body></html>;
}
