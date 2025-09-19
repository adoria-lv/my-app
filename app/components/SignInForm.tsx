'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Nepareizs e-pasts vai parole')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      setError('Notika kļūda. Lūdzu mēģiniet vēlreiz.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Adoria"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-[#706152] font-spectral">
            Pierakstīties admin panelī
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#706152] mb-2">
                E-pasta adrese
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-gray-400 focus-visible:border-[#B7AB96] focus-visible:ring-[#B7AB96]/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 text-[#706152] md:text-sm"
                placeholder="admin@adoria.lv"
                style={{
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: '#706152'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#706152] mb-2">
                Parole
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-gray-400 focus-visible:border-[#B7AB96] focus-visible:ring-[#B7AB96]/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 text-[#706152] md:text-sm"
                style={{
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: '#706152'
                }}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="text-sm text-red-700 text-center">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-[#B7AB96] hover:bg-[#706152] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B7AB96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Pierakstās...' : 'Pierakstīties'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-sm text-[#706152] text-center space-y-1">
              <p className="font-medium">Testa pieejas dati:</p>
              <p><span className="font-medium">E-pasts:</span> admin@adoria.lv</p>
              <p><span className="font-medium">Parole:</span> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}