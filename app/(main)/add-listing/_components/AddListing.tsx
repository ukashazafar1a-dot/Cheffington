'use client'

import Button from '@/components/Button'
import { getChefMe, submitRestaurantSuggestion } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const AMENITIES = [
  'Takes Reservations',
  'Full Bar',
  'Pet Friendly',
  'Wine & Beer',
  'Kid Friendly',
  'Wheelchair Accessible',
  'Outdoor Seating',
  'Accepts Credit Cards',
  'Take-Out',
  'Delivery',
  'Wifi',
] as const

const initialForm = {
  submitterName: '',
  submitterEmail: '',
  name: '',
  cuisine: '',
  phone: '',
  website: '',
  menuUrl: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  description: '',
  features: [] as string[],
}

const AddListing = () => {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('chefToken')
        : null
    if (!token) return

    let cancelled = false
    ;(async () => {
      try {
        const chef = await getChefMe(token)
        if (!chef || cancelled) return
        setForm((prev) => ({
          ...prev,
          submitterName:
            prev.submitterName ||
            `${chef.firstName || ''} ${chef.lastName || ''}`.trim(),
          submitterEmail: prev.submitterEmail || chef.email || '',
        }))
      } catch {
        // Optional pre-fill — ignore auth errors for anonymous submissions.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const isValid = useMemo(() => {
    return Boolean(
      form.submitterName.trim() &&
        form.submitterEmail.trim() &&
        form.name.trim() &&
        form.cuisine.trim() &&
        form.city.trim()
    )
  }, [form])

  const setField = (name: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleFeature = (item: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(item)
        ? prev.features.filter((f) => f !== item)
        : [...prev.features, item],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || submitting) return

    try {
      setSubmitting(true)
      setError('')
      await submitRestaurantSuggestion({
        submitterName: form.submitterName.trim(),
        submitterEmail: form.submitterEmail.trim(),
        name: form.name.trim(),
        cuisine: form.cuisine.trim(),
        phone: form.phone.trim() || undefined,
        website: form.website.trim() || undefined,
        menuUrl: form.menuUrl.trim() || undefined,
        addressLine1: form.addressLine1.trim() || undefined,
        addressLine2: form.addressLine2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim() || undefined,
        zipCode: form.zipCode.trim() || undefined,
        country: form.country.trim() || undefined,
        description: form.description.trim() || undefined,
        features: form.features,
      })
      setSuccess(true)
      setForm(initialForm)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to submit restaurant'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <section className="md:pb-44 md:pt-20 py-10">
        <div className="page-width w-full text-center">
          <h1 className="title md:pb-6 pb-4">
            Submitted for <span className="text-[#FF8400]">Review</span>
          </h1>
          <p className="subtitle mb-8 max-w-2xl mx-auto">
            Thanks — your establishment was sent to our team. You can review it
            after it is published.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button title="Back to Review" href="/review" />
            <Button title="Claim a Business" href="/claim-a-restaurant" />
            <button
              type="button"
              className="underline font-semibold"
              onClick={() => setSuccess(false)}
            >
              Submit another
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="md:pb-44 md:pt-20 py-10">
      <div className="page-width w-full">
        <h1 className="title md:pb-11 pb-6 text-center">
          Add an <span className="text-[#FF8400]">Establishment</span>
        </h1>
        <form onSubmit={handleSubmit} className="form-card page-width-narrow">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Your Name*</label>
                <input
                  type="text"
                  required
                  value={form.submitterName}
                  onChange={(e) => setField('submitterName', e.target.value)}
                  className="input-field transition-colors"
                />
              </div>
              <div>
                <label className="form-label">Your Email*</label>
                <input
                  type="email"
                  required
                  value={form.submitterEmail}
                  onChange={(e) => setField('submitterEmail', e.target.value)}
                  className="input-field transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Restaurant Name*</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className="input-field transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Cuisine type*</label>
                <input
                  type="text"
                  required
                  placeholder="Italian, Mexican, ..."
                  value={form.cuisine}
                  onChange={(e) => setField('cuisine', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setField('website', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="form-label">Link to Menu</label>
                <input
                  type="url"
                  value={form.menuUrl}
                  onChange={(e) => setField('menuUrl', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <label className="form-label">Restaurant Address*</label>
            <div className="space-y-6 mt-8">
              <input
                type="text"
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChange={(e) => setField('addressLine1', e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={form.addressLine2}
                onChange={(e) => setField('addressLine2', e.target.value)}
                className="input-field"
              />
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  required
                  placeholder="City*"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setField('state', e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={form.zipCode}
                  onChange={(e) => setField('zipCode', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <label className="form-label">Check all that apply:</label>
            <div className="grid grid-cols-2 gap-y-3 mt-8 max-sm:gap-2">
              {AMENITIES.map((item) => (
                <label
                  key={item}
                  className="flex items-center md:space-x-3 space-x-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={form.features.includes(item)}
                    onChange={() => toggleFeature(item)}
                    className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color"
                  />
                  <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <label className="form-label">Brief description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className="input-field h-44 md:h-80 mt-4"
              placeholder="Tell diners what makes this place special."
            />
          </div>

          {error ? <p className="form-error mt-6">{error}</p> : null}

          <div className="md:py-8 py-6 flex justify-center">
            <Button
              title={submitting ? 'Submitting...' : 'Submit for review'}
              type="submit"
              disabled={!isValid || submitting}
              loading={submitting}
            />
          </div>

          <p className="text-center text-sm text-gray-600">
            Listings are reviewed by Cheffington before they go live. Prefer to
            claim an existing listing?{' '}
            <button
              type="button"
              className="underline font-semibold"
              onClick={() => router.push('/claim-a-restaurant')}
            >
              Claim your business
            </button>
          </p>
        </form>
      </div>
    </section>
  )
}

export default AddListing
