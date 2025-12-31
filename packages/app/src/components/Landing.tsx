import { CONTACT_EMAIL } from '@/utils/site'
import React, { PropsWithChildren } from 'react'

export function LandingLayout(props: PropsWithChildren) {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>
        <div className='container mx-auto max-w-6xl px-4'>{props.children}</div>
      </main>
    </div>
  )
}

export function Landing() {
  return (
    <main className='min-h-screen bg-base-100 text-base-content'>
      {/* Balanced, subtle background */}
      <div aria-hidden className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -top-28 left-1/2 h-80 w-[56rem] -translate-x-1/2 rounded-full bg-primary/18 blur-3xl' />
        <div className='absolute top-40 -left-24 h-72 w-72 rounded-full bg-secondary/14 blur-3xl' />
        <div className='absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl' />
        <div className='absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--bc))_1px,transparent_0)] [background-size:28px_28px]' />
      </div>

      <header className='border-b border-base-300/60'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-5 py-4'>
          <div className='flex items-center gap-3'>
            <div className='avatar placeholder'>
              <div className='w-10 rounded-xl bg-neutral text-neutral-content'>
                <span className='text-lg'>👋</span>
              </div>
            </div>
            <span className='font-semibold tracking-tight'>Show Up</span>
          </div>

          <a href='#contact' className='btn btn-outline btn-sm rounded-full'>
            Get in touch
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className='py-10 sm:py-12'>
        <div className='mx-auto max-w-5xl px-5'>
          <div className='relative overflow-hidden rounded-3xl border border-base-300 shadow-xl'>
            <img
              src='/images/stage.jpg'
              alt='Event stage'
              className='absolute inset-0 h-full w-full object-cover object-bottom opacity-35'
            />
            <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-base-100/55 to-secondary/20' />
            <div className='absolute inset-0 bg-gradient-to-b from-base-100/30 via-base-100/55 to-base-100/80' />

            <div className='relative px-6 py-10 sm:px-10 sm:py-24'>
              <h1 className='text-5xl font-bold tracking-tight sm:text-6xl'>Show Up</h1>

              <p className='text-secondary mt-3 text-lg sm:text-xl'>
                Fewer no-shows. Better attendance. Better engagement.
              </p>

              <p className='mt-5 max-w-2xl text-base opacity-90 sm:text-lg'>
                Attendee management and reputation for real-world events and human beings.
              </p>

              <div className='mt-6'>
                <a href='#contact' className='btn btn-primary rounded-full'>
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id='why' className='border-t border-base-300/60 py-12 sm:py-16'>
        <div className='mx-auto max-w-5xl px-5'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='badge badge-accent badge-outline'>Why</div>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Attendance is the real currency of events
              </h2>
            </div>

            <div className='grid gap-8 sm:grid-cols-2'>
              <div className='space-y-5 text-base leading-relaxed opacity-90 sm:text-lg'>
                <p>
                  Free RSVPs often turn into empty chairs. Manual curation and attendee management take time and energy
                  away from running the event itself.
                </p>
              </div>

              <div className='text-base leading-relaxed opacity-90 sm:text-lg'>
                <p>
                  Organizers need better ways to understand who is likely to attend, manage expectations, and create a
                  reliable experience for everyone involved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id='problem' className='border-t border-base-300/60 bg-base-200/14 py-12 sm:py-16'>
        <div className='mx-auto max-w-5xl px-5'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='badge badge-accent badge-outline'>Problem</div>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>RSVPs alone are a weak signal</h2>
            </div>

            <p className='text-base leading-relaxed opacity-90 sm:text-lg'>
              Across community events and meetups, no-show rates commonly range from 30 to 60%, especially when RSVPs
              require little effort or commitment.
            </p>

            <p className='font-semibold'>This leads to concrete problems:</p>

            <ul className='space-y-3 text-base leading-relaxed opacity-90 sm:text-lg'>
              {[
                'Lower-quality engagement and weaker energy in the room',
                'Uncertainty around space, food, staffing, and timing',
                'More manual work before and during the event',
                'Little signal about who will actually attend',
              ].map((item) => (
                <li key={item} className='flex gap-3'>
                  <span className='mt-1 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-error/18 text-sm'>
                    ✗
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className='text-base leading-relaxed opacity-90 sm:text-lg'>
              Most event tools focus on registrations and ticketing. Very few help organizers manage attendance and
              attendee reliability.
            </p>
          </div>
        </div>
      </section>

      {/* What */}
      <section id='what' className='border-t border-base-300/60 py-12 sm:py-16'>
        <div className='mx-auto max-w-5xl px-5'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='badge badge-accent badge-outline'>What</div>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Better signals for attendance and trust</h2>
            </div>

            <p className='text-base leading-relaxed opacity-90 sm:text-lg'>
              Show Up helps organizers manage attendance, commitment, and trust across their events.
            </p>

            <p className='font-semibold'>We’re building tools for:</p>

            <ul className='space-y-3 text-base leading-relaxed opacity-90 sm:text-lg'>
              {[
                'More reliable attendance and fewer no-shows',
                'Clear commitment and intent signals from attendees',
                'Reputation and trust signals that improve curation over time',
                'Better attendee management before, during, and across events',
              ].map((item) => (
                <li key={item} className='flex gap-3'>
                  <span className='mt-1 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/18 text-sm'>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className='text-base leading-relaxed opacity-90 sm:text-lg'>
              Our focus is giving organizers practical ways to work with attendance and attendee behavior, without
              adding friction or replacing existing event or ticketing tools.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id='contact' className='border-t border-base-300/60 bg-base-200/14 py-12 sm:py-16'>
        <div className='mx-auto max-w-5xl px-5'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='badge badge-accent badge-outline'>Contact</div>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Let&apos;s talk!</h2>
            </div>

            <div className='grid items-center gap-6 lg:grid-cols-12'>
              <div className='lg:col-span-8'>
                <p className='text-base leading-relaxed opacity-90 sm:text-lg'>
                  If you organize events and care about attendance and attendee experience, we&apos;d love to hear what
                  you&apos;re working on and where things break down.
                </p>
              </div>

              <div className='lg:col-span-4'>
                <a href={`mailto:${CONTACT_EMAIL}`} className='btn btn-primary w-full rounded-full'>
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-base-300/60 py-8'>
        <div className='mx-auto flex max-w-5xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm opacity-80'>
            <span className='font-medium'>Show Up</span> <span className='opacity-60'>·</span>{' '}
            <span>Built for organizers ✨</span>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <span className='badge badge-secondary badge-outline'>Attendance</span>
            <span className='badge badge-secondary badge-outline'>Reputation</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
