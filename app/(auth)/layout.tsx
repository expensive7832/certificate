import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-around  ">
        <section className="md:flex-[0.5] flex-1">{children}</section>
        <section className="bg-[#F3F9FF] md:flex-[0.5] max-sm:hidden flex justify-center items-center min-h-screen">
            <Image
            src="/cert1.png"
            alt="mockup"
            width={500}
            height={500}
            className="object-fit-cover w-[90%] h-2/3 block ms-auto"
            />
        </section>
    </main>
  );
}
