"use client"

import { useEffect, useState } from "react"
import { addFeedback, fetchCompletedFeedbackPrograms } from "@/services/feedback.service"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Star } from "lucide-react"
import { Label } from "@/components/ui/input"
import { t } from "@/lib/i18n"
import { Spinner } from "@/components/ui/spinner"
import { AppAlert } from "@/components/shared/app-alert"

interface FeedbackProgram {
  _id: string
  title: string
  description?: string
}

export default function Feedback() {
  const [programs, setPrograms] = useState<FeedbackProgram[]>([])
  const [selectedProgram, setSelectedProgram] = useState("")
  const [rating, setRating] = useState(0)
  const [remark, setRemark] = useState("")

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await fetchCompletedFeedbackPrograms()
        setPrograms(data)
      } catch (err: any) {
        setError(err.message || t("feedback.errors.fetchFailed"))
      } finally {
        setLoading(false)
      }
    }

    loadPrograms()
  }, [])

  const handleSubmit = async () => {
    if (!selectedProgram) {
      setError(t("feedback.errors.selectProgram"))
      return
    }

    if (!rating) {
      setError(t("feedback.errors.selectRating"))
      return
    }

    try {
      setSubmitting(true)
      setError("")

      await addFeedback({
        programId: selectedProgram,
        rating,
        remark: remark.trim(),
      })

      setShowSuccessModal(true)
    } catch (err: any) {
      setError(err.message || t("feedback.errors.submitFailed"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitAnother = () => {
    setShowSuccessModal(false)
    setSelectedProgram("")
    setRating(0)
    setRemark("")
    setError("")
    window.location.reload()
  }

  return (
    <>
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-8">
          {t("feedback.title")}
        </h1>

        <div className="space-y-8">
          {/* Question 1 - Program List Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              {t("feedback.selectProgramLabel")}
            </Label>

            {loading ? (
              <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
                <Spinner size="sm" />
                <span>{t("feedback.loadingPrograms")}</span>
              </div>
            ) : programs.length === 0 ? (
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                {t("feedback.noPrograms")}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {programs.map((program) => {
                  const isSelected = selectedProgram === program._id
                  return (
                    <div
                      key={program._id}
                      onClick={() => {
                        setSelectedProgram(program._id)
                        setError("")
                      }}
                      className={`cursor-pointer rounded-lg border p-4 transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/50"
                          : "border-border bg-background hover:border-muted-foreground/50 hover:bg-muted/30"
                      }`}
                    >
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          {program.title}
                        </h3>
                        {program.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {program.description}
                          </p>
                        )}
                      </div>
                      <div
                        className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-transparent"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="size-3.5" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Question 2 - Rating */}
          {selectedProgram && (
            <div className="space-y-3 animate-fadeIn">
              <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {t("feedback.ratingLabel")}
              </Label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star)
                      setError("")
                    }}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30 hover:text-muted-foreground/50"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="text-xs font-medium text-muted-foreground">
                  {rating} {t("feedback.ratingSuffix")}
                </p>
              )}
            </div>
          )}

          {/* Question 3 - Remark */}
          {selectedProgram && rating > 0 && (
            <div className="space-y-3 animate-fadeIn">
              <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {t("feedback.remarkLabel")}
              </Label>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={t("feedback.remarkPlaceholder")}
                rows={5}
                maxLength={1000}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />

              <div className="text-right text-xs text-muted-foreground">
                {remark.length}/1000
              </div>
            </div>
          )}

          {/* Error Message (Using AppAlert) */}
          {error && (
            <AppAlert
              variant="destructive"
              description={error}
            />
          )}

          {/* Submit Button */}
          {selectedProgram && rating > 0 && (
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                size="lg"
                className="w-full sm:w-auto px-8 gap-2"
              >
                {submitting && <Spinner size="sm" />}
                {submitting ? t("feedback.submittingButton") : t("feedback.submitButton")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle2 className="size-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {t("feedback.successModal.title")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("feedback.successModal.description")}
                </p>
              </div>

              <Button
                type="button"
                onClick={handleSubmitAnother}
                className="w-full mt-4"
              >
                {t("feedback.successModal.button")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}