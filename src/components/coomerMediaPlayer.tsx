import { Image } from "@nextui-org/react";

interface CoomerMediaPlayerProps {
  url: string;
  user: string;
}

const CoomerMediaPlayer: React.FC<CoomerMediaPlayerProps> = ({ url, user }) => {
  const extension  = url.split('.').pop() ?? '';

  const videoExtensions = ['mkv', 'avi', 'mp4', 'ogv', 'webm', 'rmvb', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', '3gp', 'mov', 'ts'];
  const audioExtensions = ['mp3', 'wav', 'wma', 'aac', 'flac', 'm4a', 'ogg'];
  const photoExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'raw', 'heif', 'heic', 'svg', 'psd', 'ai'];

  const VideoPlayer: React.FC<CoomerMediaPlayerProps> = ({ url, user }) => (
    <div className="col-span-2">
      <video controls preload="none" poster={`https://img.coomer.su/icons/onlyfans/${user}`} className="m-5 w-60">
        <source src={url} type="video/mp4" />
      </video>
    </div>
  );

  const FilePlayer: React.FC<{ url: string }> = ({ url }) => (
    <>
      <p>idk what to open this with. here's the url - {url}</p>
    </>
  );

  const AudioPlayer: React.FC<CoomerMediaPlayerProps> = ({ url, user }) => (
    <>
      <video controls preload="none" poster={`https://img.coomer.su/icons/onlyfans/${user}`} className="m-5">
        <source src={url} type="video/mp4" />
      </video>
    </>
  );

  const ImagePlayer: React.FC<{ url: string }> = ({ url }) => (
    <>
      <Image
        isZoomed
        loading="lazy"
        width={240}
        src={url}
        className="m-5"
      />
    </>
  );

  if (videoExtensions.includes(extension)) {
    return <VideoPlayer url={url} user={user} key={url} />;
  } else if (audioExtensions.includes(extension)) {
    return <AudioPlayer url={url} user={user} key={url} />;
  } else if (photoExtensions.includes(extension)) {
    return <ImagePlayer url={url} key={url} />;
  } else {
    return <FilePlayer url={url} key={url} />;
  }
};

export default CoomerMediaPlayer;
