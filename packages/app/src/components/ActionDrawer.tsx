'use client'

import { Fragment, PropsWithChildren, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Props extends PropsWithChildren {
  title: string
  disabled?: boolean
  buttonText?: string
  className?: string
}

export function ActionDrawer(props: Props) {
  const [open, setOpen] = useState(false)
  let className = 'btn btn-accent btn-outline btn-sm w-full'
  if (props.className) className += ` ${props.className}`

  return (
    <>
      <button
        type='button'
        disabled={props.disabled}
        onClick={() => setOpen(true)}
        className={className}>
        {props.buttonText ?? props.title}
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-base-200 bg-opacity-80 transition-opacity" />
          </Transition.Child>

          <div className="fixed">
            <div className="absolute">
              <div className="pointer-events-none w-full fixed bottom-0 h-3/5">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-150 sm:duration-300"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  leave="transform transition ease-in-out duration-150 sm:duration-300"
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-full h-full">
                    <div className="flex flex-col bg-base-100 p-4 rounded-t-xl h-full">
                      <button type="button" className="place-self-end" onClick={() => setOpen(false)}>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <div className='container mx-auto max-w-4xl flex flex-col h-full'>
                        <Dialog.Title className="text-xl font-bold h-12">
                          {props.title}
                        </Dialog.Title>
                        <div className='grow'>{props.children}</div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
