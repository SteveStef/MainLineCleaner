"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DisclaimerProps {
    /**
     * Whether the disclaimer dialog should be shown
     */
    isOpen: boolean
    /**
     * Function to call when the dialog is closed
     */
    onClose: () => void
    /**
     * The title of the disclaimer dialog
     */
    title: string
    /**
     * The content of the disclaimer dialog
     */
    content: ReactNode
    /**
     * Optional description that appears below the title
     */
    description?: string
    /**
     * Whether to show an accept button in the dialog
     */
    showAcceptButton?: boolean
    /**
     * Text to display on the accept button
     */
    acceptButtonText?: string
    /**
     * Function to call when the accept button is clicked
     */
    onAccept?: () => void
}

export default function Disclaimer({
                               isOpen,
                               onClose,
                               title,
                               content,
                               description,
                               showAcceptButton = false,
                               acceptButtonText = "I Accept",
                               onAccept,
                           }: DisclaimerProps) {
    const handleAccept = () => {
        if (onAccept) {
            onAccept()
        }
        onClose()
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
        >
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="mt-4">{content}</div>
                {showAcceptButton && (
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleAccept}>{acceptButtonText}</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
