import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { turnConfigurationSchema } from "../../schemas/turnConfiguration.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./CustomInput";
import { turnFormatter } from "../../lib/turnHelpers";
import { Turn } from "../../types/turn.type";
import { useModal } from "../../context/Modal.context";

/** Component props */
interface Props {
    /** Set turn callback from TurnSection component of control page */
    setTurnCallback: React.Dispatch<React.SetStateAction<Turn>>;
}

/**
 * Modal to configure the turns
 * 
 * @param {Props} props - Component props
 * @returns JSX.Element
 */
export default function TurnConfigurationModal({ setTurnCallback }: Props) {
    const { setModalState } = useModal();
    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(turnConfigurationSchema),
        defaultValues: {
            prefix: "",
            startNumber: "0",
            numberOfDigits: "1"
        }
    });
    const formattedTurn = turnFormatter(
        watch("prefix"),
        watch("startNumber") ?? 0,
        watch("numberOfDigits") ?? 0
    );

    // Handle form submition
    const submit = handleSubmit(data => {
        const formattedTurn = turnFormatter(data.prefix, data.startNumber, data.numberOfDigits);

        setTurnCallback({
            id: `${formattedTurn}_${Date.now()}`,
            prefix: data.prefix,
            turnNumber: data.startNumber,
            numberOfDigits: data.numberOfDigits,
            formattedTurn
        });

        setModalState(null);
    });

    return (
        <Modal
            id="turn-configuration-modal"
            className="w-lg"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-xl font-semibold">Configuración de turnos</h2>

                <div className="flex items-center justify-between gap-4">
                    {/* PREFIX */}
                    <CustomInput
                        name="prefix"
                        control={control}
                        label="Texto"
                        placeholder="A-"
                        maxLength={5}
                        error={errors.prefix}
                        className="w-24"
                    />

                    {/* NUMBER */}
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

                    {/* NUMBER OF DIGITS */}
                    <CustomInput
                        name="numberOfDigits"
                        control={control}
                        type="number"
                        label="Número de dígitos *"
                        placeholder="0"
                        min={0}
                        max={5}
                        error={errors.numberOfDigits}
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
                    className="btn-primary text-lg"
                >
                    Aceptar
                </button>
            </div>
        </Modal>
    )
}
