"use client";

export default function Hero() {
  return (
    <section className="fade-in-up relative flex flex-col items-center justify-center px-6 py-4 text-center md:py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-[var(--halacha-navy)] sm:text-3xl md:text-4xl">
          תשובות הלכתיות מדויקות מהמקורות
        </h1>
        <p className="mx-auto max-w-xl mt-2 text-lg font-medium text-gray-700 dark:text-gray-200 md:text-xl dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
          שאל שאלות בהלכה וקבל תשובות המבוססות על שולחן ערוך, משנה ברורה ומקורות סמכותיים.
        </p>
      </div>
    </section>
  );
}
