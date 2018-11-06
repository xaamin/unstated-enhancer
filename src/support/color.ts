interface Color {
    updated?: {
        color: string,
        text: string
      },
      added?: {
        color: string,
        text: string
      },
      deleted?: {
        color: string,
        text: string
      },
      title?: {
        color: 'inherit',
        text: string
      },
      prevState?: {
        color: string,
        text: string
      },
      action?: {
        color: string,
        text: string
      },
      nextState?: {
        color: string,
        text: string
      },
      error?: {
        color: string,
        text: string
      }
  }

  export default Color
