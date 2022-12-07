import { useState } from 'preact/hooks'
import InputField from '../forms/InputField.js'
import Radio from '../forms/Radio.js'
import LabelText from '../forms/LabelText.js'

const hydrated = typeof window !== 'undefined'

export default function PaidFreeInput() {
    const [paidStatus, setPaidStatus] = useState<'free' | 'paid'>('free')
    return (
        <>
            <div class="w-fit self-start">
                <fieldset>
                    <legend>
                        <LabelText required>Is your theme free or paid?</LabelText>
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
            {!hydrated && paidStatus === 'paid' && (
                <InputField
                    label="Purchase URL (required for paid themes)"
                    name="purchaseUrl"
                    type="url"
                    placeholder="https://example.com/buy-my-theme"
                />
            )}
        </>
    )
}