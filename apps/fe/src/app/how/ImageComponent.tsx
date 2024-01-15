"use client"

import React, { useEffect, useState } from 'react'
import {Blurhash} from 'react-blurhash'

interface ImageProps {
    src: string
    hash: string
}
function ImageComponent({src, hash}: ImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
        setImageLoaded(true)
    }
    img.src = src;
  }, [src])
  return (
    <div>
      {!imageLoaded && <Blurhash hash={hash} width="100%" height="100%" resolutionX={32} resolutionY={32} punch={1}/>}
      {imageLoaded && <img src={src}/>}
    </div>
  )
}

export default ImageComponent
