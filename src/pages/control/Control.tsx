import TurnsSection from "../../components/control/TurnSection";
import BannerSection from "../../components/control/BannerSection";
import MediaController from "../../components/control/MediaController";
import LicensesModal from "../../components/control/LicensesModal";
import AppInfoModal from "../../components/control/AppInfoModal";

/**
 * Control page of the control window
 * For the checkout screen
 * 
 * @returns JSX.Element
 */
export default function Control() {

    return (
        <div className="flex gap-6 p-6 w-full h-screen">
            <TurnsSection />

            <div className="flex flex-col gap-6 w-full h-full">
                <BannerSection />

                <div className="shrink-0">
                    <MediaController />
                </div>
            </div>

            <LicensesModal />
            <AppInfoModal />
        </div>
    )
}
