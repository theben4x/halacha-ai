"use client";

export default function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 50,
        padding: "10px",
        background: "rgba(0,0,0,0.5)",
        textAlign: "center",
      }}
    >
      <p
        className="mx-auto max-w-2xl text-xs text-white"
        dir="rtl"
        lang="he"
      >
        התשובות מופקות על ידי בינה מלאכותית ומתבססות על מקורות מקוונים. אין להסתמך על תשובות אלו כפסק הלכה סופי, ובכל מקרה של ספק יש להתייעץ עם רב מורה הוראה.
      </p>
    </footer>
  );
}
