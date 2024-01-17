import ImageComponent from './ImageComponent'
import './page.css'
export default function Component() {
    return (
      <div className="fadeInUp-animation">
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
  
  