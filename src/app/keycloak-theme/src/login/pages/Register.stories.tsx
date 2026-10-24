import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory kcContext={{ realm: { registrationEmailAsUsername: true } }} />
};

export const WithEmailAlreadyExists: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: { registrationEmailAsUsername: true },
                profile: {
                    attributesByName: {
                        firstName: { value: "An" },
                        lastName: { value: "Nguyễn Văn" },
                        email: { value: "test@gmail.com" }
                    }
                },
                messagesPerField: {
                    existsError: (fieldName: string, ...otherFieldNames: string[]) => [fieldName, ...otherFieldNames].includes("email"),
                    getFirstError: () => "Email này đã được đăng ký."
                }
            }}
        />
    )
};
