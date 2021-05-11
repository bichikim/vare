import createEmotionOriginal, {Emotion, EmotionCache, Options as OriginalEmotionOptions, CSSObject} from '@emotion/css/create-instance'
import {Interpolation, serializeStyles} from '@emotion/serialize'
import {getRegisteredStyles, insertStyles} from '@emotion/utils'
import {ComponentObjectPropsOptions, ExtractPropTypes} from '@vue/runtime-core'
import clsx from 'clsx'
import {Tags} from './tags'
import {FunctionalComponent, h, inject, InjectionKey, Plugin, defineComponent, getCurrentInstance} from 'vue'

export interface Theme {
  size?: any
}

export type {CSSObject}

export const EMOTION_CACHE_CONTEXT: InjectionKey<EmotionCache> = Symbol('emotion-cash')
export const EMOTION_THEME_CONTEXT: InjectionKey<Theme> = Symbol('emotion-theme')

export type AnyComponent = Tags | FunctionalComponent<any> | ReturnType<typeof defineComponent>

export interface StyledProps {
  as?: AnyComponent
  theme?: Theme
}

export const useTheme = () => {
  const instance = getCurrentInstance()
  const props = instance?.props ?? {}

  if (props.theme) {
    return props.theme as Theme
  }

  return inject(EMOTION_THEME_CONTEXT, {})
}

export interface StyledOptions {
  label?: string
  name?: string
  target?: any
}

export interface StyledOptionWIthObject<PropsOptions extends Readonly<ComponentObjectPropsOptions>> extends StyledOptions {
  props?: PropsOptions
}

export interface StyledOptionWithArray<PropsOptions extends Readonly<any[]>> extends StyledOptions {
  props?: PropsOptions
}

export type StyledResult<Props> = ((...args: (TemplateStringsArray | Interpolation<Props>)[]) => FunctionalComponent<Props & StyledProps>)

export const createDefaultProps = (defaultProps: Readonly<any[]>) => {
  let cache: Readonly<ComponentObjectPropsOptions>

  return (props: Readonly<ComponentObjectPropsOptions> | any[]) => {
    if (Array.isArray(props)) {
      return [...defaultProps, ...props]
    }
    if (!cache) {
      cache = defaultProps.reduce((result, key) => {
        result[key] = null
        return result
      }, {} as ComponentObjectPropsOptions)
    }
    return {...cache, ...props}
  }
}

const withDefaultProps = createDefaultProps(['as', 'theme'])

export type EmptyObject = {
  // empty
}

export const createStyled = (emotion: Emotion) => {
  function styled<PropsOptions extends ComponentObjectPropsOptions = EmptyObject, Props = ExtractPropTypes<PropsOptions>>(
    element: Tags | any,
    options?: Readonly<StyledOptionWIthObject<PropsOptions>>,
  ): StyledResult<Props>
  function styled<PropNames extends string,
    Props = { [key in PropNames]: any },
    >(
    element: Tags | any,
    options?: Readonly<StyledOptionWithArray<PropNames[]>>,
  ): StyledResult<Props>

  function styled(element: AnyComponent, options: any): any {
    return (...args: any) => {
      const {props, label, target, name} = options ?? {}
      const _args = [...args, {label}]
      const _target = target ? ` ${target}` : ''

      const Emotion: FunctionalComponent<any> = (props, {slots, attrs}) => {
        const {cache: masterCache} = emotion
        const classInterpolations: string[] = []

        const theme = useTheme()

        const allAttrs = {
          ...attrs as any,
          ...props,
          theme,
        }

        const {as = element} = allAttrs

        const cache = inject(EMOTION_CACHE_CONTEXT, masterCache)

        let className = getRegisteredStyles(
          cache.registered,
          classInterpolations,
          clsx(attrs.class as any),
        )

        const serialized = serializeStyles(
          _args,
          cache.registered,
          allAttrs,
        )

        const isStringElement = typeof as === 'string'

        // ssr 용 코드 필요
        insertStyles(
          cache,
          serialized,
          isStringElement,
        )

        className += `${cache.key}-${serialized.name}`

        className += _target

        // no need to sue should forward props. vue props will work same as that

        const slot = isStringElement ? slots?.default?.() : () => slots?.default?.()

        // ssr code is needed
        const passingProps = isStringElement ? {} : props

        return h(as, {...attrs, ...passingProps, class: className}, slot)
      }

      Emotion.props = withDefaultProps(props)

      // todo 뷰 버그로 displayName 이 작동 하지 않는다
      Emotion.displayName = name ?? label ?? 'emotion'

      return Emotion
    }
  }

  return styled
}

export interface EmotionExtend extends Emotion {
  styled: ReturnType<typeof createStyled>
}

export interface EmotionOptions extends OriginalEmotionOptions {
  theme?: Theme
}

export const createEmotion = (options: EmotionOptions): Plugin & EmotionExtend => {
  const {theme, ...restOptions} = options

  const emotion = createEmotionOriginal(restOptions)

  const styled = createStyled(emotion)

  return {
    ...emotion,
    install: (app) => {
      app.provide(EMOTION_CACHE_CONTEXT, emotion.cache)
      // provide theme if the options have it
      if (theme) {
        app.provide(EMOTION_THEME_CONTEXT, theme)
      }
    },
    styled,
  }
}
