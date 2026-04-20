import Logo from "@/components/Logo";
import Banner from "@/components/ui/Banner";
import CardPanel from "@/components/ui/CardPanel";
import Light from "@/components/ui/Light"

export default async function Home() {
  return (
    <div className="flex justify-end">
      <main >
        <Light/>
        <Logo/>
        <Banner/>
        <CardPanel/>
      </main>
    </div>
  );
}
