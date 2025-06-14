import { Children, ComponentProps, ReactNode } from 'react'
import { Group, Separator, YStack } from 'tamagui'

interface ListGroupProps {
  children: ReactNode
  separator: ComponentProps<typeof Separator>
}

interface ListGroupItemProps {
  children: ReactNode
}

const ListGroupItem = ({ children }: ListGroupItemProps) => <>{children}</>

export const ListGroup = ({ children, separator }: ListGroupProps) => {
  const childArray = Children.toArray(children)

  return (
    <Group>
      {childArray.map((child, idx) => (
        <YStack key={idx}>
          <Group.Item>{child}</Group.Item>
          {idx < childArray.length - 1 && <Separator {...separator} />}
        </YStack>
      ))}
    </Group>
  )
}

ListGroup.Item = ListGroupItem
