import Head from "next/head";
import { GetServerSideProps } from "next";
import { groq } from "next-sanity";
import { client, urlFor } from "../sanity/client";

type SocialLink = { label: string; url: string };

type Profile = {
    name?: string;
    headline?: string;
    bio?: string;
    socials?: SocialLink[];
    avatar?: any;
};

type AboutProps = {
    profile: Profile | null;
};

const profileQuery = groq`*[_type == "profile"][0]`;

export const getServerSideProps: GetServerSideProps<AboutProps> = async () => {
    const profile = await client.fetch(profileQuery);
    return { props: { profile: profile || null } };
};

export default function AboutPage({ profile }: AboutProps) {
    return (
        <>
            <Head>
                <title>About – Richa Singh</title>
            </Head>

            <main className="min-h-screen page-grid-bg text-foreground">
                <section className="max-w-6xl mx-auto px-6 pt-24 pb-24 border-t border-white/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                        .about
                    </p>

                    <div className="grid md:grid-cols-2 gap-10 items-start">
                        <div className="space-y-4 text-sm md:text-base leading-relaxed">
                            <h1 className="text-2xl md:text-3xl font-medium mb-2">
                                {profile?.headline || "Designer & visual thinker"}
                            </h1>
                            <p>
                                {profile?.bio ||
                                    "Write your extended about text in the Profile document in Sanity."}
                            </p>
                        </div>

                        {profile?.avatar && (
                            <div className="h-[420px] md:h-[520px] w-full rounded-3xl overflow-hidden border border-white/10">
                                <img
                                    src={urlFor(profile.avatar).width(800).height(800).url()}
                                    alt={profile.name || "Profile photo"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}