import { useState } from 'preact/hooks'
import useHydrated from '../../hooks/useHydrated.js'
import Button from '../Button.js'
import ImageInput from '../forms/ImageInput.js'
import InputField from '../forms/InputField.js'
import LabelText from '../forms/LabelText.js'
import Radio from '../forms/Radio.js'
import TextAreaField from '../forms/TextAreaField.js'

export default function ThemeSubmitForm() {
    const [paidStatus, setPaidStatus] = useState<'free' | 'paid'>('free')
    const hydrated = useHydrated()
    return (
        <form
            method="post"
            class="max-w-screen-sm flex flex-col items-center gap-4 mx-auto my-8 px-4"
            action="/themes/submit/success"
            data-netlify="true"
            netlify-honeypot="bot-field"
        >
            {/* https://docs.netlify.com/forms/spam-filters/#honeypot-field */}
            <p class="hidden">
                <label>
                    Don&apos;t fill this out if you&apos;re human:{' '}
                    <input name="bot-field" />
                </label>
            </p>
            <ImageInput name="previewImage" label="Preview image" required />
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
                            name="freeOrPaid"
                            value="free"
                            checked={paidStatus === 'free'}
                            onInput={() => setPaidStatus('free')}
                        >
                            Free
                        </Radio>
                        <Radio
                            name="freeOrPaid"
                            value="paid"
                            checked={paidStatus === 'paid'}
                            onInput={() => setPaidStatus('paid')}
                        >
                            Paid
                        </Radio>
                    </div>
                </fieldset>
            </div>
            {hydrated ? (
                <InputField
                    label="Public repo URL"
                    name="repoUrl"
                    type="url"
                    placeholder="https://github.com/me/my-awesome-theme"
                    required={paidStatus === 'free'}
                />
            ) : (
                <InputField
                    label="Public repo URL (required for free themes)"
                    name="repoUrl"
                    type="url"
                    placeholder="https://github.com/me/my-awesome-theme"
                />
            )}
            {paidStatus === 'paid' && (
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
            <TextAreaField
                label="Short description"
                name="shortDescription"
                placeholder="A short description of your theme, displayed on the theme list page"
                required
            />
            <Button type="submit" theme="primary">
                Submit
            </Button>
        </form>
    )
}
