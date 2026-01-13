import React from 'react'
import { useDispatch } from 'react-redux'
import { MenuItemLink, useTranslate, setSidebarVisibility } from 'react-admin'
import RadioIcon from '@material-ui/icons/Radio'
import { makeStyles, useMediaQuery } from '@material-ui/core'
import SubMenu from './SubMenu'
import libraryRadioLists, { decadePresets } from '../libraryRadio/libraryRadioLists'

const useStyles = makeStyles(
  (theme) => ({
    active: {
      color: theme.palette.text.primary,
      fontWeight: 'bold',
    },
  }),
  { name: 'NDLibraryRadioSubMenu' },
)

const LibraryRadioSubMenu = ({ state, setState, sidebarIsOpen, dense }) => {
  const classes = useStyles()
  const translate = useTranslate()
  const dispatch = useDispatch()
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  const handleToggle = (menu) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }))
  }

  const handleMenuClick = () => {
    if (isSmall) {
      dispatch(setSidebarVisibility(false))
    }
  }

  const renderRadioMenuItemLink = (type, radioConfig) => {
    const radioAddress = `/libraryRadio/${type}`
    const name = translate(`resources.libraryRadio.lists.${type}`, {
      _: type.charAt(0).toUpperCase() + type.slice(1),
    })

    return (
      <MenuItemLink
        key={radioAddress}
        to={radioAddress}
        activeClassName={classes.active}
        primaryText={name}
        leftIcon={radioConfig.icon}
        sidebarIsOpen={sidebarIsOpen}
        dense={dense}
        exact
        onClick={handleMenuClick}
      />
    )
  }

  const renderDecadeMenuItemLink = (decade) => {
    const decadeAddress = `/libraryRadio/decade/${decade.fromYear}-${decade.toYear}`
    return (
      <MenuItemLink
        key={decadeAddress}
        to={decadeAddress}
        activeClassName={classes.active}
        primaryText={decade.label}
        sidebarIsOpen={sidebarIsOpen}
        dense={dense}
        exact
        onClick={handleMenuClick}
      />
    )
  }

  return (
    <>
      <SubMenu
        handleToggle={() => handleToggle('menuLibraryRadio')}
        isOpen={state.menuLibraryRadio}
        sidebarIsOpen={sidebarIsOpen}
        name="menu.libraryRadio"
        icon={<RadioIcon />}
        dense={dense}
      >
        {/* Main radio options */}
        {Object.keys(libraryRadioLists).map((type) =>
          renderRadioMenuItemLink(type, libraryRadioLists[type]),
        )}

        {/* By Genre link */}
        <MenuItemLink
          key="/libraryRadio/byGenre"
          to="/libraryRadio/byGenre"
          activeClassName={classes.active}
          primaryText={translate('resources.libraryRadio.lists.byGenre', {
            _: 'By Genre',
          })}
          sidebarIsOpen={sidebarIsOpen}
          dense={dense}
          onClick={handleMenuClick}
        />
      </SubMenu>

      {/* Decades submenu */}
      <SubMenu
        handleToggle={() => handleToggle('menuLibraryRadioDecades')}
        isOpen={state.menuLibraryRadioDecades}
        sidebarIsOpen={sidebarIsOpen}
        name="menu.libraryRadioDecades"
        icon={<RadioIcon style={{ opacity: 0.6 }} />}
        dense={dense}
      >
        {decadePresets.map(renderDecadeMenuItemLink)}
      </SubMenu>
    </>
  )
}

export default LibraryRadioSubMenu
