import ImageComponent from './ImageComponent'
import './page.css'
export default function Component() {
    return (
      <div className="fadeInUp-animation">
        <ImageComponent
          src="https://myawsbucketaneesh.s3.eu-west-3.amazonaws.com/Screen+Shot+2024-01-14+at+9.12.43+AM.png"
          hash='L3S?DVxu~qRj_3WB%MofRj%M%Mt7'
        />
        <ImageComponent
          src="https://myawsbucketaneesh.s3.eu-west-3.amazonaws.com/two.png"
          hash='L3S?DVxu~qRj_3WB%MofRj%M%Mt7'
        />
        <ImageComponent
          src="https://myawsbucketaneesh.s3.eu-west-3.amazonaws.com/four.png"
          hash='L3S?DVxu~qRj_3WB%MofRj%M%Mt7'
        />
      </div>
    )
  }
  
  