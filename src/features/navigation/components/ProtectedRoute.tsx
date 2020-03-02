import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { NavigationStackProp } from "react-navigation-stack"
import { useEffect, ReactNode } from "react"
import { Routes } from "../_routes"
import { RootStoreType } from "../../../redux/rootReducer"

const ProtectedRoute = ({
  authenticated,
  navigation,
  children,
}: ReduxProps & { navigation: NavigationStackProp; children: ReactNode }) => {
  useEffect(() => {
    if (!authenticated) {
      navigation.navigate(Routes.LoginStack.Login)
    }
  }, [authenticated, navigation])

  return <>{children}</>
}

const mapStateToProps = (state: RootStoreType) => ({
  authenticated: state.userReducer.authenticated,
})

const connector = connect(mapStateToProps, {})

type ReduxProps = ConnectedProps<typeof connector>

export default connector(ProtectedRoute)
