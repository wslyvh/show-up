import React, { useCallback, useState } from 'react'
import { CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'

interface Props {
  onUpload: (file?: File) => void
}

export function ImageUpload(props: Props) {
  const [filePreview, setFilePreview] = useState('')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = async function () {
          setFilePreview(reader.result as string)
          props.onUpload(file)
        }
      }
    },
    [props]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/png': ['.png'],
    },
  })

  function clearFile() {
    setFilePreview('')
    props.onUpload()
  }

  return (
    <div>
      {!filePreview && (
        <div className='flex items-center justify-center w-full' {...getRootProps()}>
          <label
            htmlFor='dropzone-file'
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-neutral hover:bg-gray-800 border-gray-700 hover:border-gray-600'>
            <div className='flex flex-col items-center justify-center pb-4'>
              <CloudArrowUpIcon className='w-12 h-12 text-gray-400 my-4' />
              <p className='mb-2 text-sm text-gray-400 text-center'>
                <span className='font-semibold'>Click to upload</span> or drag and drop
              </p>
              <p className='text-xs text-gray-400 text-center px-4'>
                .png format, with a recommended size of 1200:600 (2:1 ratio)
              </p>
            </div>
            <input id='dropzone-file' {...getInputProps()} />
          </label>
        </div>
      )}

      {filePreview && (
        <div className='relative w-full h-64'>
          <button type='button' className='absolute btn btn-sm btn-square btn-error right-2 top-2' onClick={clearFile}>
            <TrashIcon className='w-4 h-4' />
          </button>
          <img src={filePreview} alt='Image preview' className='rounded-lg w-full h-full object-cover' />
        </div>
      )}
    </div>
  )
}
