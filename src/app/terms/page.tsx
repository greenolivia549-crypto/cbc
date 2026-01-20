import React from 'react';

export const metadata = {
    title: 'Terms of Service | GreenBlog',
    description: 'Terms of Service for GreenBlog',
};

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>

            <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using GreenBlog, you accept and agree to be bound by the terms and provision of this agreement.
                        In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">2. User Conduct</h2>
                    <p>
                        You agree to use the website only for lawful purposes. You are prohibited from posting on or transmitting through the website any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, racially, ethnically, or otherwise objectionable.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Intellectual Property</h2>
                    <p>
                        All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of GreenBlog or its content suppliers and protected by international copyright laws.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Disclaimer of Warranties</h2>
                    <p>
                        The site is provided on an &quot;as is&quot; and &quot;as available&quot; basis. GreenBlog makes no representations or warranties of any kind, express or implied, as to the operation of this site or the information, content, materials, or products included on this site.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Limitation of Liability</h2>
                    <p>
                        GreenBlog will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days&apos; notice prior to any new terms taking effect.
                    </p>
                </section>
            </div>
        </div>
    );
}
