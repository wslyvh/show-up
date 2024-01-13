'use client'

import React, { ChangeEvent, useState } from 'react'
import { CreateEventData, EventMetadata, Visibility } from '@/utils/types'
import { DefaultDepositFee, WHITELISTED_TOKENS } from '@/utils/network'
import { SelectBox } from '@/components/SelectBox'
import { ImageUpload } from './ImageUpload'
import { CONFIG } from '@/utils/config'
import { Confirm } from './Confirm'
import { InfoDrawer } from './Info'
import dayjs from 'dayjs'

const defaultStartDate = dayjs().hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss')
const defaultEndDate = dayjs().hour(13).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss')

export function CreateForm() {
  const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
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
    visibility: Visibility.Public,
    links: [],
    tags: [],
  })
  const [eventConditions, setEventConditions] = useState<CreateEventData>({
    chainId: CONFIG.DEFAULT_CHAINS[0].id,
    endDate: defaultEndDate,
    customEndDate: false,
    limit: 0,
    depositFee: DefaultDepositFee,
  })
  const [image, setImage] = useState<File>()

  function handleEventChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!e.target.id) return

    if (
      e.target.id === 'start' &&
      (dayjs(event.end).isSame(defaultEndDate) || dayjs(event.end).isBefore(dayjs(e.target.value)))
    ) {
      setEvent((state) => ({
        ...state,
        [e.target.id]: e.target.value,
        end: dayjs(e.target.value).add(2, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
      }))

      if (!eventConditions.customEndDate) {
        setEventConditions((state) => ({
          ...state,
          endDate: dayjs(e.target.value).add(2, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
        }))
      }

      return
    }

    if (e.target.id === 'end') {
      setEvent((state) => ({
        ...state,
        end: e.target.value,
      }))

      if (!eventConditions.customEndDate) {
        setEventConditions((state) => ({
          ...state,
          endDate: e.target.value,
        }))
      }

      return
    }

    if (e.target.id === 'public' || e.target.id === 'unlisted') {
      setEvent((state) => ({
        ...state,
        visibility: e.target.value === 'Public' ? Visibility.Public : Visibility.Unlisted,
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
      setEventConditions((state) => ({
        ...state,
        depositFee: Number(e.target.value),
      }))

      return
    }

    if (e.target.id === 'recipient') {
      setEventConditions((state) => ({
        ...state,
        recipient: e.target.value,
      }))

      return
    }

    if (e.target.id === 'limit') {
      setEventConditions((state) => ({
        ...state,
        limit: Number(e.target.value),
      }))

      return
    }

    if (e.target.id === 'endDate') {
      setEventConditions((state) => ({
        ...state,
        endDate: e.target.value,
        customEndDate: true,
      }))

      return
    }
  }

  function handleNetworkChange(value: string) {
    setEventConditions((state) => ({
      ...state,
      chainId: Number(value),
    }))
  }

  function handleModuleChange(value: string) {
    if (value === 'Ether') {
      setEventConditions((state) => ({
        ...state,
        tokenAddress: '',
      }))
      return
    }

    const token = WHITELISTED_TOKENS.find((i) => i.address === value)!!
    setEventConditions((state) => ({
      ...state,
      tokenAddress: token.address,
    }))
  }

  async function handleFileUpload(file?: File) {
    setImage(file)
  }

  return (
    <div>
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
              <span className='label-text'>
                Description <span className='text-xs'>(supports markdown)</span>
              </span>
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

          <div className='form-control w-full'>
            <label className='label' htmlFor='visibility'>
              <span className='label-text'>Visibility</span>
            </label>

            <div className='flex gap-4'>
              <div className='flex gap-2 items-center'>
                <input
                  className='radio radio-sm'
                  type='radio'
                  value='Public'
                  id='public'
                  checked={event.visibility === Visibility.Public}
                  onChange={handleEventChange}
                />

                <label className='label' htmlFor='public'>
                  <span className='label-text'>Public</span>
                </label>
              </div>

              <div className='flex gap-2 items-center'>
                <input
                  className='radio radio-sm'
                  type='radio'
                  value='Unlisted'
                  id='unlisted'
                  checked={event.visibility === Visibility.Unlisted}
                  onChange={handleEventChange}
                />
                <label className='label' htmlFor='unlisted'>
                  <span className='label-text'>Unlisted</span>
                </label>
              </div>
            </div>
          </div>
        </>

        {/* Image Upload */}
        <div className='divider divider-start mt-8'>Cover Image</div>
        <>
          <div className='form-control w-full'>
            <ImageUpload onUpload={handleFileUpload} />
          </div>
        </>

        {/* Condition Modules */}
        <div className='divider divider-start mt-8'>Conditions</div>
        <>
          <div className='form-control w-full'>
            <label className='label' htmlFor='network'>
              <span className='label-text'>Network</span>
            </label>
            <select
              id='currency'
              className='select select-bordered select-sm'
              onChange={(e) => handleNetworkChange(e.target.value)}
              value={eventConditions.chainId}
              required>
              {CONFIG.DEFAULT_CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='endDate'>
              <span className='label-text'>
                Registration Date <span className='text-xs'>(defaults to event end date)</span>
              </span>
            </label>
            <input
              id='endDate'
              type='datetime-local'
              required
              className='input input-sm input-bordered w-full'
              value={eventConditions.endDate}
              onChange={handleConditionChange}
            />
          </div>

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
                value={eventConditions.tokenAddress ?? ''}
                required>
                <option value='Ether'>Ether</option>
                {WHITELISTED_TOKENS.filter((i) => i.chainId === eventConditions.chainId).map((token) => (
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
                value={eventConditions.depositFee}
                onChange={handleConditionChange}
              />
            </div>
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='limit'>
              <span className='label-text'>Max. participants</span>
            </label>
            <input
              id='limit'
              type='number'
              min='0'
              step='10'
              required
              className='input input-sm input-bordered w-full'
              value={eventConditions.limit || 0}
              onChange={handleConditionChange}
            />
          </div>

          <div className='form-control w-full'>
            <label className='label' htmlFor='recipient'>
              <span className='label-text'>
                Recipient of no-show fees
                <span className='text-xs'> (Leave empty to split the pot between all participants)</span>
              </span>
            </label>
            <input
              id='recipient'
              type='text'
              required
              className='input input-sm input-bordered w-full'
              placeholder='Address of the recipient'
              value={eventConditions.recipient || ''}
              onChange={handleConditionChange}
            />
          </div>
        </>
      </form>

      <div className='flex justify-end mt-4'>
        <Confirm event={event} conditions={eventConditions} image={image} />
      </div>
    </div>
  )
}
