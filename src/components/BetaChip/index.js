export default function BetaChip() {
  if (window.location.href.includes('integration')) {
    return <div className='bso-betachip text-center'>Version [bêta]</div>;
  }
  return (
    <div className='bso-betachip text-center out-of-the-box'>
      Version [bêta]
    </div>
  );
}
