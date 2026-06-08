import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'
import { handleContactFormSubmit } from '#/utils/contact'

const contactMethods: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  href?: string
}[] = [
  {
    icon: Mail,
    value: 'amgookool@gmail.com',
    href: 'mailto:amgookool@gmail.com',
  },
  { icon: Phone, value: '+1 (868) 475-5372', href: 'tel:+18684755372' },
  { icon: MapPin, value: 'Trinidad & Tobago' },
]

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!(formData.name && formData.email && formData.message)) return

    setFormError(false)
    const success = await handleContactFormSubmit(formData)
    if (success) {
      setFormSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } else {
      setFormError(true)
    }
  }

  return (
    <Section id="contact">
      <div className="grid gap-12 md:grid-cols-5">
        {/* contact info */}
        <ScrollReveal className="md:col-span-2 space-y-8">
          <div>
            <SectionHeader
              eyebrow="Collaboration"
              title="Let's build something exceptional together."
              className="pb-2.5"
            />
            <p className="text-sm leading-relaxed text-(--sea-ink-soft)">
              Open to discussing new engineering roles, backend architecture
              challenges, frontend designs, or contract positions. Leave a
              message or reach out directly!
            </p>
          </div>

          <div>
            {contactMethods.map((item) => (
              <div
                key={item.value}
                className="flex items-center gap-3 border-b border-(--line) py-3.5 last:border-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--line) bg-(--chip-bg) text-(--lagoon)">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-medium text-(--sea-ink-soft) transition hover:text-(--lagoon-deep)"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-(--sea-ink-soft)">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* form */}
        <ScrollReveal delay={100} className="md:col-span-3">
          <div className="island-shell rounded-2xl p-6 sm:p-8">
            {formSubmitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-(--accent-soft) text-(--lagoon-deep)">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-(--sea-ink)">
                    Message Sent!
                  </h3>
                  <p className="mt-1.5 text-sm text-(--sea-ink-soft)">
                    Thank you for reaching out — I&rsquo;ll get back to you as
                    soon as possible.
                  </p>
                </div>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-2 rounded-full border border-(--line) bg-(--surface2) px-5 py-2.5 text-sm font-semibold text-(--sea-ink) transition hover:-translate-y-0.5"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="mb-2 text-lg font-bold text-(--sea-ink) pb-2">
                  Send a Message
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input"
                      placeholder="Adrian Gookool"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="field py-2.5">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="textarea"
                    placeholder="Hi Adrian, let's collaborate on..."
                  />
                </div>
                {formError && (
                  <p
                    role="alert"
                    className="text-sm font-medium text-red-600 dark:text-red-400"
                  >
                    Something went wrong sending your message. Please try again
                    or email me directly.
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--accent-soft) px-6 py-3 text-sm font-bold text-(--lagoon-deep) transition hover:-translate-y-0.5 hover:bg-(--accent-mid)"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </Section>
  )
}
