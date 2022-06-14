import '../css/style.css';
import '../css/all.css';
import Share from './Share.js';
import domtoimage from 'dom-to-image';
import {useState, useRef, useEffect, createRef} from 'react';

function Filter(props) {

  const classNames = ["oneCut", "twoCuts", "fourCuts"];
  const [goshare, setGoshare] = useState(false);
  const [data, setData] = useState({...props.data, dataurl : null});

  const canvasRefs = useRef([]);
  const photoWrapper = useRef(null);

  canvasRefs.current = Array(props.data.cuts).fill().map((e,idx)=>canvasRefs.current[idx] || createRef());
  const changeFilter = () => {
    console.log('filter try')
    for(let i=0 ; i<data.cuts ; i++){
      window.Caman("#photoCanvas"+i, function () {
        this.brightness(-5).render();
      });
    }
  }

  const goShare = () =>{

    domtoimage.toJpeg(photoWrapper.current,{quality:1})
    .then((url)=>{
      let tmp = data;
      tmp.dataurl = url;
      setData(tmp);
      setGoshare(true);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
  }


  useEffect(()=>{ //* put photo data for each canvas
    console.log(props.data.select);
    canvasRefs.current.map((ref, idx)=>{
      if(ref!==null){
        ref.current.getContext("2d").putImageData(props.data.images[props.data.select[idx]-1],0,0);
        ref.current.id = "photoCanvas"+idx;
      }
    })
  },[]);
  
  return (
    <div className="Wrapper">
      {goshare?
        <Share setGomain={props.setGomain} data = {data}/>:
        <div className="Content">
            <div>this is Filter page</div>
            <div className='Button' onClick={changeFilter}>FILTER</div>

            <div className="photoFrame" ref={photoWrapper}>
              <img className="photoBack" src={require(`../assets/frame${data.frame}.png`)}/>
              <div className="photoItems">
                {canvasRefs.current.map((ref, idx) => {
                  return(
                    <canvas key={idx} className={`${classNames[Math.floor(props.data.cuts/2)]}`} height={props.data.vertical?"1006":"674"} width={props.data.vertical?"735":"1002"} ref={ref}/>
                  )
                })}
              </div>
            </div>

            <div className="Button" onClick={goShare}>Go Share</div>
        </div>
      }
    </div>
  );
}

export default Filter;
