import { useEffect, useMemo, useState } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';
import Identicon from 'identicon.js';

import './Menu.css';

const MainMenu = ({ account }) => {
  const [activeItem, setActiveItem] = useState('todoList');
  const [img, setImg] = useState();

  const options = useMemo(
    () =>
      function () {
        return {
          foreground: [0, 0, 0, 255],
          background: [255, 255, 255, 255],
          margin: 0.2,
          size: 420,
          format: 'svg',
        };
      },
    []
  );

  useEffect(() => {
    if (account) {
      setImg(new Identicon(account, options()).toString());
    }
  }, [account, options]);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu id='main_menu'>
      <Menu.Item
        name='Meme of the day'
        active={activeItem === 'todoList'}
        onClick={handleItemClick}
      />
      <p className='account'>
        <Icon name='user' />
        {account}
      </p>
      {account ? (
        <Image src={`data:image/svg+xml;base64,${img}`} size='mini' circular />
      ) : null}
    </Menu>
  );
};

export default MainMenu;
