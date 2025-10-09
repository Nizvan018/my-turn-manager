import TurnsSection from "../../components/client/TurnsSection";
import MediaPlayer from "../../components/client/MediaPlayer";
import BannerSection from "../../components/client/BannerSection";

/**
 * Client page of the client window
 * For the client screen
 * 
 * @returns JSX.Element
 */
export default function Home() {
    return (
        <main className="flex gap-6 p-6 w-full h-screen">
            <TurnsSection />

            <div className="flex flex-col gap-6 w-full h-full">
                <BannerSection />

                <MediaPlayer />
            </div>
        </main>
    )
}
