export default function Control() {
    const handleSelectFiles = async () => {
        const paths = await window.utils.selectMediaFiles();

        if (paths.length > 0) {
            // setMediaPaths(paths);
            // setCurrentIndex(0);
            window.utils.sendPaths(paths);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1>Esta es la página de control</h1>

            <button
                onClick={handleSelectFiles}
                className="text-white p-2 bg-blue-500"
            >
                Seleccionar archivos
            </button>
        </div>
    )
}
