"use client"
import { Button } from '@/components/ui/button'
import ImageComponent from './ImageComponent'
import './page.css'
import { useRouter } from 'next/navigation'
export default function Component() {
  const router = useRouter()
    return (
      <div className="fadeInUp-animation">
        <div className='flex justify-center items-center mt-3 mb-3'>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mr-6">
          system design:
        </h1>
        <Button onClick={() => {
          router.push('/auth')
        }} className='mt-1'>enter app</Button>
      </div>
        <ImageComponent
          src="https://myawsbucketaneesh.s3.eu-west-3.amazonaws.com/Screen+Shot+2024-01-17+at+9.55.54+AM.png"
          hash='L3S?DVxu~qRj_3WB%MofRj%M%Mt7'
        />
        <ImageComponent
          src="https://myawsbucketaneesh.s3.eu-west-3.amazonaws.com/Screen+Shot+2024-01-17+at+9.56.09+AM.png"
          hash='L3S?DVxu~qRj_3WB%MofRj%M%Mt7'
        />
        <ImageComponent
          src="https://myawsbucketaneesh.s3.eu-west-3.amazonaws.com/Screen+Shot+2024-01-17+at+9.56.46+AM.png"
          hash='L3S?DVxu~qRj_3WB%MofRj%M%Mt7'
        />
      </div>
    )
  }
  
  