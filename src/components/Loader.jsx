import { BiLoaderAlt } from 'react-icons/bi';
import styles from '../styles/loader.module.css';

export default function Loader({text}) {
   return (
      <h3 className={styles.container} >
         <BiLoaderAlt />
         Loading{text && ` ${text}`}
      </h3>
   );
}