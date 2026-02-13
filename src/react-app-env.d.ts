interface IProcess {
  env: {
    NODE_ENV: 'development' | 'production'
  }
}

declare module '*module.scss'

declare const process: IProcess