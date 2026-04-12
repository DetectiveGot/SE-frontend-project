import Logo from "@/components/Logo";
import Banner from "@/components/ui/Banner";
import CardPanel from "@/components/ui/CardPanel";
import Light from "@/components/ui/Light"
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {

  return (
    <div className="flex justify-end">

      <main >
        <div className="fixed inset-0 -z-10">
          <img
            src="/images/BG2.png"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <img
            src="/images/BG.png"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
          
          <div
            className="absolute inset-0 w-full h-full z-20 bottom-0"
            style={{  
              background: `linear-gradient(to top, #cebba89a, #ffffff00)`
            }}
          />
        </div>

      <Light/>
      <Logo></Logo>
      <Banner/>
      <CardPanel/>

      </main>
    </div>
  );
}
