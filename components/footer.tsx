import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export const Footer = () => {
  return (
    <div className="footer bg-base-100">
      <div className="flex-1">
        <p>
          <span>Made with some ♥ by </span>
          <Link href="https://github.com/aherschel">Al </Link>
          <span>using </span>
          <Link href="https://docs.amplify.aws/">AWS Amplify </Link>
          <span>- </span>
          <Link href="https://github.com/aherschel/als-rewards-club"><FontAwesomeIcon icon={faGithub} /> Source</Link>
        </p>
      </div>
    </div>
  );
}
