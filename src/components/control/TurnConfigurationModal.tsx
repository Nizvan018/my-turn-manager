import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { turnConfigurationSchema } from "../../schemas/turnConfiguration.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./CustomInput";

const turnPreview = (text: string, startNumber: string, digitNumber: number) => {
    return `${text}${startNumber.padStart(digitNumber, "0")}`;
}

export default function TurnConfigurationModal() {
    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(turnConfigurationSchema),
        defaultValues: {
            text: "",
            startNumber: "0",
            digitNumber: "1"
        }
    });
    const formattedTurn = turnPreview(
        watch("text"),
        watch("startNumber") ?? "0",
        Number(watch("digitNumber") ?? 0)
    );

    const submit = handleSubmit(data => {
        console.log(data);
    });

    return (
        <Modal
            id="turn-configuration-modal"
            className="w-lg"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-xl font-semibold">Configuración de turnos</h2>

                <div className="flex items-center justify-between gap-4">
                    <CustomInput
                        name="text"
                        control={control}
                        label="Texto"
                        placeholder="A-"
                        maxLength={5}
                        error={errors.text}
                        className="w-24"
                    />

                    <CustomInput
                        name="startNumber"
                        control={control}
                        type="number"
                        label="Número de inicio *"
                        placeholder="0"
                        min={0}
                        max={99999}
                        error={errors.startNumber}
                        className="w-40"
                    />

                    <CustomInput
                        name="digitNumber"
                        control={control}
                        type="number"
                        label="Número de dígitos *"
                        placeholder="0"
                        min={0}
                        max={5}
                        error={errors.digitNumber}
                        className="w-40"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                    <span className="text-nowrap text-curious-blue-950/60 font-light">Vista previa del turno</span>
                    <div className="w-full h-px bg-curious-blue-950/30"></div>
                </div>

                <div className="flex justify-center items-center w-full p-6 rounded-3xl border border-curious-blue-950/10 bg-curious-blue-950/5">
                    <span className="text-6xl font-semibold">{formattedTurn}</span>
                </div>

                <button
                    onClick={submit}
                    className="btn-primary"
                >
                    Aceptar
                </button>
            </div>
        </Modal>
    )
}
