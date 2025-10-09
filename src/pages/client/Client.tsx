import TurnsSection from "../../components/client/TurnsSection"
// import MediaPlayer from "../../components/MediaPlayer"

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
            {/* <MediaPlayer /> */}
        </main>
    )
}
