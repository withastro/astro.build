import '@cloudfour/elastic-textarea'
import { useState } from 'preact/hooks'
import Button from '../Button.js'
import Field from '../forms/Field.js'
import ImageInput from '../forms/ImageInput.js'
import InputField from '../forms/InputField.js'
import LabelText from '../forms/LabelText.js'
import Radio from '../forms/Radio.js'
import TagInput from '../forms/TagInput.js'
import TextAreaField from '../forms/TextAreaField.js'

const hydrated = typeof window !== 'undefined'

export default function ThemeSubmitForm() {
    const [paidStatus, setPaidStatus] = useState<'free' | 'paid'>('free')
    return (
        <div class="flex flex-col gap-4 items-center">
            {/* https://docs.netlify.com/forms/spam-filters/#honeypot-field */}
            <p class="hidden">
                <label>
                    Don&apos;t fill this out if you&apos;re human:{' '}
                    <input name="bot-field" />
                </label>
            </p>
            <ImageInput
                name="mainPreviewImage"
                label="Preview image"
                required
            />
            <div class="grid md:grid-cols-2 w-full gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <ImageInput
                        key={i}
                        name={'previewImage' + (i + 1)}
                        label={'Additional image ' + (i + 1)}
                    />
                ))}
            </div>
            <InputField
                name="authorName"
                label="Your name"
                placeholder="Sally Ride"
                required
            />
            <InputField
                name="authorEmail"
                label="Your email"
                type="email"
                placeholder="me@website.com"
                required
            />
            <InputField
                label="Theme name"
                name="themeName"
                placeholder="My Awesome Theme"
                required
            />
            <div class="w-fit self-start">
                <fieldset>
                    <legend>
                        <LabelText>Is your theme free or paid?</LabelText>
                    </legend>
                    <div class="flex items-center gap-3">
                        <Radio
                            name="paidStatus"
                            value="free"
                            checked={paidStatus === 'free'}
                            onInput={() => setPaidStatus('free')}
                        >
                            Free
                        </Radio>
                        <Radio
                            name="paidStatus"
                            value="paid"
                            checked={paidStatus === 'paid'}
                            onInput={() => setPaidStatus('paid')}
                        >
                            Paid
                        </Radio>
                    </div>
                </fieldset>
            </div>
            {hydrated && paidStatus === 'free' && (
                <InputField
                    label="Public repo URL"
                    name="repoUrl"
                    type="url"
                    placeholder="https://github.com/me/my-awesome-theme"
                    required
                />
            )}
            {!hydrated && (
                <InputField
                    label="Public repo URL (required for free themes)"
                    name="repoUrl"
                    type="url"
                    placeholder="https://github.com/me/my-awesome-theme"
                />
            )}
            {hydrated && paidStatus === 'paid' && (
                <InputField
                    label="Purchase URL"
                    name="purchaseUrl"
                    type="url"
                    placeholder="https://example.com/buy-my-theme"
                    required
                />
            )}
            {!hydrated && (
                <InputField
                    label="Purchase URL (required for paid themes)"
                    name="purchaseUrl"
                    type="url"
                    placeholder="https://example.com/buy-my-theme"
                />
            )}
            <InputField
                label="Live demo URL"
                name="liveDemoUrl"
                type="url"
                placeholder="https://example.com/theme-demo"
            />
            <InputField
                label="Short description"
                name="shortDescription"
                placeholder="A short description of your theme, displayed on the theme list page"
                required
            />
            <elastic-textarea class="contents">
                <TextAreaField
                    label="Full description"
                    name="fullDescription"
                    placeholder="A longer description of your theme, displayed on the theme details page. **Supports Markdown!**"
                    required
                    rows={3}
                />
            </elastic-textarea>
            <Field label="Tags">
                <TagInput name="tags" />
            </Field>
            <Button type="submit" theme="primary">
                Submit
            </Button>
        </div>
    )
}

declare module 'preact' {
    namespace JSX {
        interface IntrinsicElements {
            'elastic-textarea': JSX.HTMLAttributes<HTMLElement>
        }
    }
}
