import { site } from '../app/site.ts';
import { define } from '@/lib/utils.ts';
import { asset } from 'fresh/runtime';
import { Global } from '@/islands/Global.tsx';
import { stripUserData } from '@/app/user.ts';

export default define.page(({ Component, state }) => {
  return (
    <html lang={site.lang}>
      <head>
        <title>{site.name}</title>
        <meta content={site.name} property='og:title'></meta>
        <meta content={site.description} name='description' />
        <meta content={site.description} property='og:description' />
        <meta content={asset(site.previewImage)} property='og:image' />
        <meta property='og:type' content='website' />

        <meta charset='utf-8' />
        <meta
          name='viewport'
          content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
        />
        <meta name='color-scheme' content='light dark' />
        <link rel='apple-touch-icon' href={asset(site.appIcon)} />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content={site.themeColor} />
        <meta name='format-detection' content='telephone=no' />
        <link rel='manifest' href={asset('/manifest.json')} />
        <style dangerouslySetInnerHTML={{ __html: `:root{--primary: ${site.themeColor}` }}></style>
        <link rel='stylesheet' href={asset('/css/theme.css')} />
        <link rel='stylesheet' href={asset('/css/main.css')} />
        <link rel='stylesheet' href={asset('/css/components.css')} />
        <link rel='stylesheet' href={asset('/css/verbum.css')} />
        <link rel='icon' href={asset(site.favicon)} />
      </head>
      <body>
        <Global user={stripUserData(state.user)}>
          <Component />
        </Global>

        <script src={asset('/js/init.js')}></script>
      </body>
    </html>
  );
});
