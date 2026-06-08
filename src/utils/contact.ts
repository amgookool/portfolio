import {
  addDoc,
  collection,
  FirestoreError,
  Timestamp,
} from 'firebase/firestore'
import { firestore as db } from '#/utils/firebase'

export type ContactFormData = {
  name: string
  email: string
  message: string
}

type FireStoreMailData = {
  to: string
  message: {
    subject: string
    html: string
  }
}

/** Address that contact-form notification emails are delivered to. */
const CONTACT_RECIPIENT = 'amgookool@hotmail.com'

/**
 * Persists a contact-form submission to Firestore and queues a notification
 * email. Returns `true` only when both writes succeed, so callers can
 * distinguish a real submission from a failure instead of always reporting
 * success to the user.
 */
export async function handleContactFormSubmit(
  formData: ContactFormData,
): Promise<boolean> {
  try {
    const writeData = {
      ...formData,
      created_at: Timestamp.now(),
      read_at: null,
    }

    const sendTo: FireStoreMailData = {
      to: CONTACT_RECIPIENT,
      message: {
        subject: `New Portfolio Contact Form Submission from ${formData.name}`,
        html: `
          <p>You have received a new message from your portfolio contact form:</p>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Message:</strong> ${formData.message}</p>
              `,
      },
    }

    await addDoc(collection(db, 'portfolio-requests'), writeData)
    await addDoc(collection(db, 'portfolio-mail'), sendTo)
    return true
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error('Firestore error:', error.code, error.message)
    } else {
      console.error('Contact form submission failed:', error)
    }
    return false
  }
}
