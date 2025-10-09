import { ImageOff } from "lucide-react";

const exampleData = {
    title: "¡Bienvenido a Papelería Quiquitos!"
}

export default function BannerSection() {
    return (
        <section className="flex gap-6 w-full grow">
            <div className="flex justify-center items-center w-auto h-full aspect-square rounded-[48px] border border-curious-blue-950/10 bg-curious-blue-950/5 backdrop-blur-sm">
                <ImageOff className="size-24 text-slate-400" />
            </div>

            <article className="flex flex-col gap-6 w-full h-full p-6 rounded-[48px] border border-curious-blue-950/10 bg-gradient-to-br from-curious-blue-500/15 from-20% to-brilliant-rose-500/15">
                <h1 className="text-3xl font-semibold">{exampleData.title}</h1>

                <span>More text...</span>
            </article>
        </section>
    )
}
