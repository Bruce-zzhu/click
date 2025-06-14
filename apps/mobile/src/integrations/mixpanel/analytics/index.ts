import * as mixpanelFunctions from '@app/integrations/mixpanel/functions'
import * as eventFunctions from './events'

export const analytics = {
  ...mixpanelFunctions,
  ...eventFunctions,
}
