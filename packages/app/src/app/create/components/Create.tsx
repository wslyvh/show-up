'use client'

import React, { ChangeEvent, useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useEventManagement } from '@/context/EventManagement'
import { ConditionModuleData, ConditionModuleType, EventMetadata } from '@/utils/types'
import { AddressZero, DefaultDepositFee, GetTokenDecimals, WHITELISTED_TOKENS } from '@/utils/network'
import { formatUnits } from 'viem/utils'
import { basicEtherAddress, basicTokenAddress } from '@/abis'
import { SelectBox } from '@/components/SelectBox'
import { ImageUpload } from './ImageUpload'
import { CONFIG } from '@/utils/config'
import { Confirm } from './Confirm'
import { InfoDrawer } from './Info'
import NP from 'number-precision'
import dayjs from 'dayjs'

const defaultStartDate = dayjs().hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss')
const defaultEndDate = dayjs().hour(13).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss')

export function CreateForm() {
  const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
  const eventManagement = useEventManagement()
  const [event, setEvent] = useState<EventMetadata>({
    appId: CONFIG.DEFAULT_APP_ID,
    title: '',
    description: '',
    start: defaultStartDate,
    end: defaultEndDate,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: '',
    website: '',
    imageUrl: '',
    links: [],
    tags: [],
  })
  const [conditions, setConditions] = useState<ConditionModuleData>({
    type: ConditionModuleType.BasicEther,
    address: (basicEtherAddress as any)[CONFIG.DEFAULT_CHAIN_ID],
    endDate: '', // uses event.endDate as default
    depositFee: DefaultDepositFee,
    maxParticipants: 0,
    tokenAddress: AddressZero,
  })
  const [image, setImage] = useState<File>()

  function handleEventChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!e.target.id) return

    if (e.target.id === 'start' && (dayjs(event.end).isSame(defaultEndDate)) || dayjs(event.end).isBefore(dayjs(e.target.value))) {
      setEvent((state) => ({
        ...state,
        [e.target.id]: e.target.value,
        end: dayjs(e.target.value).add(2, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
      }))

      return
    }

    setEvent((state) => ({
      ...state,
      [e.target.id]: e.target.value,
    }))
  }

  function handleConditionChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!e.target.id) return

    if (e.target.id === 'depositFee' && floatRegExp.test(e.target.value)) {
      setConditions((state) => ({
        ...state,
        [e.target.id]: NP.times(e.target.value, 10 ** GetTokenDecimals(conditions.tokenAddress)),
      }))

      return
    }

    setConditions((state) => ({
      ...state,
      [e.target.id]: e.target.value,
    }))
  }

  function handleModuleChange(value: string) {
    if (value === 'Ether') {
      return setConditions((state) => ({
        ...state,
        type: ConditionModuleType.BasicEther,
        address: (basicEtherAddress as any)[CONFIG.DEFAULT_CHAIN_ID],
      }))
    }

    setConditions((state) => ({
      ...state,
      type: ConditionModuleType.BasicToken,
      address: (basicTokenAddress as any)[CONFIG.DEFAULT_CHAIN_ID],
      tokenAddress: value,
    }))
  }

  async function handleFileUpload(file?: File) {
    setImage(file)
  }

  async function submit() {
    await eventManagement.Create(event, conditions, image)
  }

  return (
    <div>
      {eventManagement.message && (
        <div className='alert alert-error text-sm py-2 px-4 mt-8'>
          <InformationCircleIcon className='h-6 w-6 text-error-400' />
          <span>{eventManagement.message}</span>
        </div>
      )}

      <form className='relative my-4'>
        {/* Event Metadata */}
        <>
          <div className='absolute -top-4 right-0'>
            <InfoDrawer />
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='title'>
              <span className='label-text'>
                Title <span className='text-accent'>*</span>
              </span>
            </label>
            <input
              id='title'
              type='text'
              required
              className='input input-sm input-bordered w-full'
              value={event.title}
              onChange={handleEventChange}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='description'>
              <span className='label-text'>Description</span>
            </label>
            <textarea
              id='description'
              className='textarea textarea-sm textarea-bordered h-24 w-full'
              value={event.description}
              onChange={handleEventChange}
            />
          </div>

          <div className='flex flex-row justify-between form-control w-full gap-4 flex-col sm:flex-row'>
            <div className='flex-grow'>
              <label className='label' htmlFor='start'>
                <span className='label-text'>
                  Start <span className='text-accent'>*</span>
                </span>
              </label>
              <input
                id='start'
                type='datetime-local'
                required
                className='input input-sm input-bordered w-full'
                value={event.start}
                onChange={handleEventChange}
              />
            </div>
            <div className='flex-grow'>
              <label className='label' htmlFor='end'>
                <span className='label-text'>
                  End <span className='text-accent'>*</span>
                </span>
              </label>
              <input
                id='end'
                type='datetime-local'
                required
                className='input input-sm input-bordered w-full'
                value={event.end}
                onChange={handleEventChange}
              />
            </div>
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='timezone'>
              <span className='label-text'>
                Timezone <span className='text-accent'>*</span>
              </span>
            </label>
            <SelectBox
              id='timezone'
              options={Intl.supportedValuesOf('timeZone')}
              defaultValue={event.timezone}
              onChange={(value) => {
                setEvent((state) => ({
                  ...state,
                  timezone: value,
                }))
              }}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='location'>
              <span className='label-text'>
                Location <span className='text-accent'>*</span>
              </span>
            </label>
            <input
              id='location'
              type='text'
              required
              className='input input-sm input-bordered w-full'
              value={event.location}
              onChange={handleEventChange}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='website'>
              <span className='label-text'>Website</span>
            </label>
            <input
              id='website'
              type='text'
              className='input input-sm input-bordered w-full'
              value={event.website}
              onChange={handleEventChange}
            />
          </div>
        </>

        {/* Condition Modules */}
        <>
          <div className='form-control w-full'>
            <label className='label' htmlFor='title'>
              <span className='label-text'>
                Deposit fee <span className='text-accent'>*</span>
              </span>
            </label>

            <div className='flex gap-4'>
              <select
                id='currency'
                className='select select-bordered select-sm w-32'
                onChange={(e) => handleModuleChange(e.target.value)}
                value={conditions.tokenAddress ? conditions.tokenAddress : ''}
                required>
                <option value=''>Ether</option>
                {WHITELISTED_TOKENS.filter((i) => i.chainId === CONFIG.DEFAULT_CHAIN_ID).map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <input
                id='depositFee'
                type='number'
                step='0.01'
                max='1000.00'
                required
                className='input input-sm input-bordered w-full'
                value={formatUnits(conditions.depositFee, 18) || 0}
                onChange={handleConditionChange}
              />
            </div>
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='maxParticipants'>
              <span className='label-text'>Max. participants</span>
            </label>
            <input
              id='maxParticipants'
              type='number'
              min='0'
              step='10'
              required
              className='input input-sm input-bordered w-full'
              value={conditions.maxParticipants || 0}
              onChange={handleConditionChange}
            />
          </div>
        </>

        {/* Image Upload */}
        <>
          <div className='form-control w-full'>
            <label className='label' htmlFor='timezone'>
              <span className='label-text'>Cover Image</span>
            </label>
            <ImageUpload onUpload={handleFileUpload} />
          </div>
        </>
      </form>

      <div className='flex justify-end mt-4'>
        <Confirm event={event} conditions={conditions} image={image} />
      </div>
    </div>
  )
}
